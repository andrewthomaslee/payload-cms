{
  description = "payload-cms repo";

  # Flake inputs
  inputs = {
    kube-infra.url = "https://flakehub.com/f/andrewthomaslee/kube-infra/0.1.x";
    flake-schemas.follows = "kube-infra/flake-schemas";
    nixpkgs.follows = "kube-infra/nixpkgs";
  };

  # Flake outputs that other flakes can use
  outputs = {
    self,
    flake-schemas,
    nixpkgs,
    kube-infra,
  }: let
    inherit (nixpkgs) lib;
    # Helpers for producing system-specific outputs
    supportedSystems = ["x86_64-linux"];
    forEachSupportedSystem = f:
      nixpkgs.lib.genAttrs supportedSystems (system:
        f {
          pkgs = import nixpkgs {
            inherit system;
            overlays = [kube-infra.inputs.home.overlays.default];
            config.allowUnfree = true;
          };
        });

    environmentsDir = ./kubernetes/environments;
    environmentsNames = builtins.attrNames (lib.filterAttrs (n: v: v == "directory") (builtins.readDir environmentsDir));
    mkKustomizeOutputs = pkgs:
      lib.genAttrs (map (name: "kustomize-${name}") environmentsNames) (name: let
        envName = lib.removePrefix "kustomize-" name;
      in
        pkgs.runCommand "kustomize-${envName}" {
          nativeBuildInputs = [pkgs.kustomize];
          src = ./kubernetes;
        } ''
          kustomize build $src/environments/${envName} > $out
        '');

    mkOciOutputs = pkgs:
      lib.genAttrs (map (name: "oci-${name}") environmentsNames) (name: let
        envName = lib.removePrefix "oci-" name;
        kustomizeBuild =
          pkgs.runCommand "kustomize-${envName}-build" {
            nativeBuildInputs = [pkgs.kustomize];
            src = ./kubernetes;
          } ''
            kustomize build $src/environments/${envName} > $out
          '';
        rootfs = pkgs.runCommand "oci-${envName}-rootfs" {} ''
          mkdir -p $out
          cat > $out/kustomization.yaml <<EOF
          resources:
            - resources.yaml
          EOF
          cp ${kustomizeBuild} $out/resources.yaml
        '';
      in
        pkgs.dockerTools.buildImage {
          name = "oci-${envName}";
          tag = "latest";
          copyToRoot = rootfs;
        });
  in {
    # Schemas tell Nix about the structure of your flake's outputs
    inherit (flake-schemas) schemas;

    # Development environments
    devShells = forEachSupportedSystem ({pkgs}:
      with pkgs; {
        default = mkShell {
          # Pinned packages available in the environment
          packages = [
            pnpm_10
            nodejs_22
            bun
            bash
            jq
            yq
            mongodb-compass
            kompose
            kubeseal
            kustomize
            dive
            k3s
          ];

          # Environment variables
          env = {
            NODE_ENV = "development";
            HOST = "0.0.0.0";
          };

          # A hook run every time you enter the environment
          shellHook = ''
            export REPO_ROOT
            REPO_ROOT=$(git rev-parse --show-toplevel)
            eval "$(bunx varlock load --format shell --path "$REPO_ROOT"/.env)"

            mkdir -p "$REPO_ROOT"/.secrets/kubeconfig
            export KUBECONFIG
            KUBECONFIG=$(find "$REPO_ROOT/.secrets/kubeconfig" -type f 2>/dev/null | paste -sd ":" -)
            kubectl config get-contexts

            pnpm install
            echo "Enjoy! Payload-CMS"
          '';
        };
      });

    packages = forEachSupportedSystem ({pkgs}: (mkKustomizeOutputs pkgs) // (mkOciOutputs pkgs));

    apps = forEachSupportedSystem ({pkgs}: let
      system = pkgs.stdenv.hostPlatform.system;
    in {
      inherit (kube-infra.apps."${system}") seal-env;
    });

    checks = forEachSupportedSystem ({pkgs}: mkKustomizeOutputs pkgs);
  };
}

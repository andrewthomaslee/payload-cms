{
  description = "payload-cms repo";

  # Flake inputs
  inputs = {
    flake-schemas.url = "https://flakehub.com/f/DeterminateSystems/flake-schemas/*";

    nixpkgs.url = "https://flakehub.com/f/NixOS/nixpkgs/*";
  };

  # Flake outputs that other flakes can use
  outputs = {
    self,
    flake-schemas,
    nixpkgs,
  }: let
    # Helpers for producing system-specific outputs
    supportedSystems = ["x86_64-linux"];
    forEachSupportedSystem = f:
      nixpkgs.lib.genAttrs supportedSystems (system:
        f {
          pkgs = import nixpkgs {
            inherit system;
            config.allowUnfree = true;
          };
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
          ];

          # Environment variables
          env = {
            NEXT_PUBLIC_SERVER_URL = "http://localhost:3000";
          };

          # A hook run every time you enter the environment
          shellHook = ''
            export REPO_ROOT
            REPO_ROOT=$(git rev-parse --show-toplevel)

            eval "$(bunx varlock load --format shell --path "$REPO_ROOT"/.env)"
            pnpm install
            echo "Enjoy!"
          '';
        };
      });

    packages = forEachSupportedSystem ({pkgs}: let
      manifests = pkgs.stdenv.mkDerivation {
        name = "kubernetes-manifests-dir";
        src = ./kubernetes;
        buildCommand = ''
          mkdir -p $out/kubernetes
          cp -r $src/* $out/kubernetes/
          rm -f $out/kubernetes/env-configmap.yaml || true
        '';
      };
    in {
      kubernetes-manifests = pkgs.dockerTools.buildImage {
        name = "payload-cms/kubernetes-manifests";
        tag = "latest";
        copyToRoot = [manifests];
        config.Labels."org.opencontainers.image.description" = "pre-packaged payload-cms kubernetes manifests";
      };
    });

    apps = forEachSupportedSystem ({pkgs}: {
      default = let
        kompose-convert = pkgs.writeShellScriptBin "kompose-convert" ''
          rm -fr "$REPO_ROOT"/kubernetes && \
          mkdir -p "$REPO_ROOT"/kubernetes && \
          ${pkgs.kompose}/bin/kompose --namespace payload-cms --file docker-compose.production.yaml convert --out "$REPO_ROOT"/kubernetes/ && \
          yq -yi 'del(.spec.template.spec.volumes)' "$REPO_ROOT"/kubernetes/payload-cms-statefulset.yaml && \
          rm -f "$REPO_ROOT"/kubernetes/payload-cms-persistentvolumeclaim.yaml

          # Generate kustomization.yaml from all remaining YAML files
          KUST="$REPO_ROOT/kubernetes/kustomization.yaml"
          echo "apiVersion: kustomize.config.k8s.io/v1beta1" > "$KUST"
          echo "kind: Kustomization" >> "$KUST"
          echo "resources:" >> "$KUST"
          for f in "$REPO_ROOT"/kubernetes/*.yaml; do
            name="$(basename "$f")"
            [ "$name" = "kustomization.yaml" ] && continue
            [ "$name" = "env-configmap.yaml" ] && continue
            echo "  - $name" >> "$KUST"
          done
        '';
      in {
        type = "app";
        program = "${kompose-convert}/bin/kompose-convert";
      };
    });
  };
}

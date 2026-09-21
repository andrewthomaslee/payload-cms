{
  description = "payload-cms repo — OCI app images + Helm chart + Flux GitOps";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    flake-parts.url = "github:hercules-ci/flake-parts";
    flake-parts.inputs.nixpkgs-lib.follows = "nixpkgs";

    mkdocs-flake = {
      url = "github:applicative-systems/mkdocs-flake";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs:
    inputs.flake-parts.lib.mkFlake {inherit inputs;} ({self, ...}: {
      systems = ["x86_64-linux"];

      imports = [inputs.mkdocs-flake.flakeModules.default];

      perSystem = {pkgs, ...}: let
        inherit (inputs.nixpkgs) lib;

        environmentsDir = ./kubernetes/environments;
        envNames = builtins.attrNames (
          lib.filterAttrs (_: v: v == "directory") (builtins.readDir environmentsDir)
        );

        mkKustomizeCheck = env:
          pkgs.runCommand "kustomize-${env}" {
            nativeBuildInputs = [pkgs.kustomize];
            src = ./kubernetes;
          } ''
            kustomize build $src/environments/${env} > $out
          '';
      in {
        formatter = pkgs.alejandra;

        # Mkdocs documentation site: `nix build .#documentation`
        # and `nix run .#watch-documentation`.
        documentation.mkdocs-root = ./documentation;

        # Lint gate: alejandra (format), statix (anti-patterns), deadnix (dead
        # bindings). Runs inside `nix flake check`, so CI fails on findings.
        # Source is filtered to .nix files so manifest changes don't
        # invalidate the check and secrets never enter this closure.
        # Plus per-environment Flux manifest rendering — fails `nix flake
        # check` on broken manifests.
        checks =
          {
            lint =
              pkgs.runCommand "lint" {
                nativeBuildInputs = with pkgs; [alejandra statix deadnix];
              } ''
                cd ${lib.sources.sourceFilesBySuffices self [".nix"]}
                alejandra --check .
                statix check .
                deadnix --fail .
                touch $out
              '';
          }
          // lib.genAttrs envNames mkKustomizeCheck;

        packages = lib.genAttrs envNames mkKustomizeCheck;

        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            pnpm_10
            nodejs_22
            bun
            bash
            jq
            yq
            kubectl
            kubeseal
            kustomize
            kubernetes-helm
            oras
            crane
            fluxcd
            deadnix
            statix
            alejandra
          ];

          env = {
            NODE_ENV = "development";
            HOST = "0.0.0.0";
          };

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
      };
    });
}

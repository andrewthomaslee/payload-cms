{
  description = "payload-cms";

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
            bash
            jq
            nodejs
            bun
            pnpm
            mongodb-compass
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
            bun install
            echo "Enjoy!"
          '';
        };
      });
  };
}

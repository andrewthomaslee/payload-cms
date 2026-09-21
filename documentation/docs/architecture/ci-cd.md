# CI/CD

Everything is `workflow_dispatch` — no workflow runs automatically on push or PR.

| Workflow                  | Purpose                                                                    |
| ------------------------- | -------------------------------------------------------------------------- |
| `ci`                      | `nix flake check` (alejandra/statix/deadnix lint gate + kustomize renders) |
| `build-dev`               | App image → `ghcr.io/<owner>/payload-cms/site/dev:0.1.N` (WARP, cosign)    |
| `chart`                   | Helm lint/package → `helm push` → `…/chart:0.1.N`                          |
| `promote-production`      | `crane copy` dev digest → `…/site/production:0.1.N` (approval-gated)       |
| `release`                 | `flux push artifact` → `…/kustomization/{env}:0.1.N` + FlakeHub publish    |
| `docs`                    | `nix build .#documentation` → GitHub Pages                                 |

## Versioning

Every OCI artifact is tagged `0.1.<N>` where `N = git rev-list --count HEAD` (commits since git init). The promote workflow takes the tag as a manual input so the production count can never drift from the dev image it points at.

## Artifact flow

1. `build-dev` pushes the app image; the dev `HelmRelease` pins the tag (or `latest`).
2. `chart` pushes the chart; each environment's `OCIRepository` resolves it by semver (`>=0.1.0`).
3. `release` pushes the environment manifests (namespace + `OCIRepository` + `HelmRelease` + sealed secret); the root Flux `Kustomization` in `kubernetes/clusters/borg/` pulls them.

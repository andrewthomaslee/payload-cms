# Architecture

High-level architecture of the payload-cms delivery pipeline. Flesh out as needed.

## TL;DR

```text
git (dev) --workflow--> OCI artifacts on GHCR --flux--> borg cluster
                          site/dev:0.1.N
                          chart:0.1.N
                          kustomization/{dev,production}:0.1.N
```

- App images and the Helm chart are built by manual GitHub Actions runs.
- Flux pulls the chart and the per-environment manifests from GHCR.
- Per-environment values are inline in each `HelmRelease`; secrets are sealed secrets (pending deployment).
- Production images are **promoted** from dev by digest copy — never rebuilt.

## Pages

- [Branching](branching.md) — `dev` / `production` model.
- [CI/CD](ci-cd.md) — the six manual workflows and versioning.
- [WARP + Tunnel](warp-tunnel.md) — how builds and runtime reach MongoDB.
- [Manual GitHub Setup](github-setup.md) — environments + branch protection (out of scope for automation).

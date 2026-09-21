# payload-cms

A Payload CMS 3 + Next.js 16 website shipped as OCI artifacts to GitHub Container Registry and deployed to Kubernetes (cluster `borg`) with Flux GitOps. This repo doubles as a reference template for **vibe coding Payload CMS with an AI harness**.

## What's here

- `src/` — Payload CMS collections, config, and the Next.js frontend.
- `charts/payload-cms/` — Deployment-only Helm chart.
- `kubernetes/` — Flux manifests: per-environment `HelmRelease`/`OCIRepository` and the one-time cluster bootstrap.
- `.github/workflows/` — all-manual CI/CD pushing OCI artifacts to GHCR.
- `documentation/` — this site.

## Quick links

- [Architecture](architecture/index.md) — branching, CI/CD, WARP + tunnel.
- [Helm](helm/chart-values.md) — chart values and environment overlays.
- [Decisions](decisions/index.md) — ADRs for the deployment design.

## Quickstart

```bash
nix develop   # dev shell: node 22, pnpm 10, k8s/helm tooling
cp .env.example .env
pnpm dev      # http://localhost:3000
```

The docs are built with `nix build .#documentation` and watched with `nix run .#watch-documentation`. They publish to <https://docs.bff.netsam.dev> via the manual `docs` workflow.

!!! note
    This site is a skeleton; flesh it out as the project grows.

# AGENTS.md

Guidance for AI coding agents (OpenCode, Claude Code, Codex, etc.) working in this repository.

This repo is both a Payload CMS website and a reference template for **vibe coding Payload CMS with an AI harness**. Human-facing docs live in `documentation/` and are published to <https://docs.bff.netsam.dev>.

> **Overhaul in progress.** The repo is being restructured; the authoritative implementation plan and current state are in `.baton-pass/LATEST.md` (read it first if it exists). Sections marked _(planned)_ describe the target state — verify they exist before relying on them.

## Branch model

- `dev` — the only branch you work on. All changes land here.
- `production` — created at the end of the overhaul; PR-only (dev → production), branch-protected.
- `main` — **archived. Never touch it, never merge from it, never base work on it.**

## Stack

- Payload CMS 3.85.x + Next.js 16 (App Router) + React 19 + TypeScript
- MongoDB via `@payloadcms/db-mongodb`
- pnpm 10 (pinned via `packageManager` in `package.json`), Node 22
- Nix flake devShell is the canonical dev environment (`nixpkgs` tracks upstream `nixos-unstable`)
- Delivery: OCI artifacts on GHCR, Helm chart, Flux GitOps on a Kubernetes cluster named `borg`

## Environment

```bash
nix develop   # node 22, pnpm 10, bun, kubectl/helm/kustomize/oras/kubeseal (planned), nix linters
pnpm install  # also runs automatically via the devShell shellHook
```

The shellHook loads env vars from `.env` via varlock (schema: `.env.schema`) and assembles `KUBECONFIG` from files in `.secrets/kubeconfig/`. **Never commit `.env` or `.secrets/`.**

## Common commands

| Task                                | Command                                                          |
| ----------------------------------- | ---------------------------------------------------------------- |
| Dev server                          | `pnpm dev`                                                       |
| Build                               | `pnpm build`                                                     |
| Lint                                | `pnpm lint` (autofix: `pnpm lint:fix`)                           |
| Tests                               | `pnpm test` (`pnpm test:int`, `pnpm test:e2e`)                   |
| Payload CLI / codegen               | `pnpm payload`, `pnpm generate:types`, `pnpm generate:importmap` |
| Nix checks                          | `nix flake check`                                                |
| Docs build _(planned)_              | `nix build .#documentation`                                      |
| Docs watch mode _(planned)_         | `nix run .#watch-documentation`                                  |
| Chart render smoke test _(planned)_ | `helm template payload-cms charts/payload-cms`                   |

Run `pnpm lint` and the relevant tests before considering any change complete.

## Repo layout

```
src/                     # Payload config, collections, Next.js frontend
charts/payload-cms/      # (planned) Deployment-only Helm chart
kubernetes/
  environments/
    dev/                 # (planned) Flux OCIRepository + HelmRelease + sealed secrets
    production/          # (planned) same, for production namespace
documentation/           # (planned) mkdocs.yml + docs/ (mkdocs-flake)
.github/workflows/       # all manual workflow_dispatch (see CI/CD)
flake.nix                # devShell + kustomize/docs outputs; nixpkgs = nixos-unstable
Dockerfile               # multi-stage node:22-alpine, Next standalone, port 3000, uid 1001
```

## CI/CD — everything is manual

No workflow runs automatically on push or PR. Dispatch by hand (`gh workflow run`).

| Workflow                  | Purpose                                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yaml`                 | `nix flake check`                                                                                                                |
| `build-dev.yaml`          | Build app image → `site/dev:0.1.N` (WARP + live MongoDB at build time), cosign-signed                                            |
| `chart.yaml`              | Helm lint/package → oras push chart + per-env values OCI                                                                         |
| `promote-production.yaml` | Input tag `0.1.N`; re-tag dev digest → `site/production` behind `production` environment required-reviewers approval. No rebuild |
| `docs.yaml`               | `nix build .#documentation` → GitHub Pages (`docs.bff.netsam.dev`)                                                               |
| `release.yaml`            | Kustomize OCI flux-manifest artifacts + FlakeHub publish                                                                         |

**Versioning:** every OCI artifact is tagged `0.1.<N>` where `N = git rev-list --count HEAD` (commits since git init).

## OCI artifacts (GHCR)

| Artifact                          | Path                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| App image (dev)                   | `ghcr.io/<owner>/payload-cms/site/dev`                       |
| App image (prod, promoted digest) | `ghcr.io/<owner>/payload-cms/site/production`                |
| Helm chart                        | `ghcr.io/<owner>/payload-cms/chart`                          |
| Chart values (dev)                | `ghcr.io/<owner>/payload-cms/chart/values-dev`               |
| Chart values (prod)               | `ghcr.io/<owner>/payload-cms/chart/values-production`        |
| Flux manifests                    | `ghcr.io/<owner>/payload-cms/kustomization/{dev,production}` |

## Deployment _(planned)_

- `charts/payload-cms/` — Deployment-only chart. Values surface: `image`, `replicaCount` (**RWO volume ⇒ 1 replica; RWX ⇒ >1**), `mongodb` connection (secret ref), payload env via `envFromSecret`, `service`, `httproute` and Traefik `ingressRoute` toggles, `persistence` (`accessMode`/`storageClass`/`size`/`existingClaim`; `.next/cache` stays `emptyDir`), `resources`, probes, hardened `securityContext` (uid/gid 1001, drop ALL caps), `imagePullSecrets`.
- `kubernetes/environments/{dev,production}/` — Flux `OCIRepository` (chart) + `HelmRelease` with `valuesFrom: OCIRepository` (the separate values artifacts) + sealed secrets. Namespaces: `payload-cms-dev` / `payload-cms-production` on cluster `borg`.
- MongoDB is cluster-managed and lives outside this repo; the app reaches it through an in-cluster cloudflared tunnel. CI builds reach it via WARP in the runner.
- Cluster secrets are sealed with `kubeseal`. Runtime app env comes from a Kubernetes Secret; build-time env uses a BuildKit secret mount (see `Dockerfile`).

## Conventions

- TypeScript; follow the existing eslint/prettier config. No new dependencies without justification.
- Nix files: format with `alejandra`, lint with `statix` and `deadnix`.
- Minimal, on-task changes; match existing code style.
- If you change workflows, repo layout, or conventions, update this AGENTS.md and `documentation/`.

## Hard rules

1. Never touch `main`. Work on `dev` only.
2. Never commit secrets (`.env`, `.secrets/`, kubeconfigs).
3. Never make a workflow run automatically — all stay `workflow_dispatch`.
4. Verify with the commands above before declaring work done.

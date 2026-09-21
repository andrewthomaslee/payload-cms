# AGENTS.md

Guidance for AI coding agents (OpenCode, Claude Code, Codex, etc.) working in this repository.

This repo is both a Payload CMS website and a reference template for **vibe coding Payload CMS with an AI harness**. Human-facing docs live in `documentation/` and are published to <https://docs.bff.netsam.dev>.

## Branch model

- `dev` — the only branch you work on. All changes land here.
- `production` — PR-only (dev → production), branch-protected. Branch protection is configured by hand in GitHub (**out of scope** for automation).
- `main` — **archived. Never touch it, never merge from it, never base work on it.**

## Stack

- Payload CMS 3.85.x + Next.js 16 (App Router) + React 19 + TypeScript
- MongoDB via `@payloadcms/db-mongodb`
- pnpm 10 (pinned via `packageManager` in `package.json`), Node 22
- Nix flake devShell is the canonical dev environment (`nixpkgs` tracks upstream `nixos-unstable`, flake-parts)
- Delivery: OCI artifacts on GHCR, Helm chart, Flux GitOps on a Kubernetes cluster named `borg`

## Environment

```bash
nix develop   # node 22, pnpm 10, bun, kubectl/helm/kustomize/oras/crane/flux/kubeseal, nix linters
pnpm install  # also runs automatically via the devShell shellHook
```

The shellHook loads env vars from `.env` via varlock (schema: `.env.schema`) and assembles `KUBECONFIG` from files in `.secrets/kubeconfig/`. **Never commit `.env` or `.secrets/`.**

## Common commands

| Task                          | Command                                                          |
| ----------------------------- | ---------------------------------------------------------------- |
| Dev server                    | `pnpm dev`                                                       |
| Build                         | `pnpm build`                                                     |
| Lint                          | `pnpm lint` (autofix: `pnpm lint:fix`)                           |
| Tests                         | `pnpm test` (`pnpm test:int`, `pnpm test:e2e`)                   |
| Payload CLI / codegen         | `pnpm payload`, `pnpm generate:types`, `pnpm generate:importmap` |
| Nix checks (lint + kustomize) | `nix flake check`                                                |
| Docs build                    | `nix build .#documentation`                                      |
| Docs watch mode               | `nix run .#watch-documentation`                                  |
| Chart lint                    | `helm lint charts/payload-cms`                                   |
| Chart render smoke test       | `helm template payload-cms charts/payload-cms`                   |
| Render Flux env manifests     | `kustomize build kubernetes/environments/dev`                    |

Run `pnpm lint` and the relevant tests before considering any change complete. `nix flake check` gates Nix formatting (alejandra), anti-patterns (statix), dead bindings (deadnix), and manifest renders.

## Repo layout

```
src/                     # Payload config, collections, Next.js frontend
charts/payload-cms/      # Deployment-only Helm chart
kubernetes/
  environments/
    dev/                 # Namespace + OCIRepository + HelmRelease (inline values) + sealed-secret template
    production/          # same, for production namespace
  clusters/
    borg/                # one-time bootstrap: Flux Kustomization + OCIRepository (kustomization artifacts)
documentation/           # mkdocs.yml + docs/ (mkdocs-flake)
.github/workflows/       # all manual workflow_dispatch (see CI/CD)
flake.nix                # flake-parts devShell + checks (lint, kustomize) + mkdocs; nixpkgs = nixos-unstable
Dockerfile               # multi-stage node:22-alpine, Next standalone, port 3000, uid 1001
```

## CI/CD — everything is manual

No workflow runs automatically on push or PR. Dispatch by hand (`gh workflow run`).

| Workflow                  | Purpose                                                                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `ci.yaml`                 | `nix flake check`                                                                                                                      |
| `build-dev.yaml`          | Build app image → `site/dev:0.1.N` (WARP + live MongoDB at build time), cosign-signed                                                  |
| `chart.yaml`              | Helm lint/package → `helm push` chart to GHCR (helm OCI media types)                                                                   |
| `promote-production.yaml` | Input tag `0.1.N`; `crane copy` dev digest → `site/production` behind `production` environment required-reviewers approval. No rebuild |
| `docs.yaml`               | `nix build .#documentation` → GitHub Pages (`docs.bff.netsam.dev`)                                                                     |
| `release.yaml`            | Push `kubernetes/environments/{env}` as Flux kustomization OCI artifact + FlakeHub publish                                             |

**Versioning:** every OCI artifact is tagged `0.1.<N>` where `N = git rev-list --count HEAD` (commits since git init).

## OCI artifacts (GHCR)

| Artifact                          | Path                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| App image (dev)                   | `ghcr.io/<owner>/payload-cms/site/dev`                       |
| App image (prod, promoted digest) | `ghcr.io/<owner>/payload-cms/site/production`                |
| Helm chart                        | `ghcr.io/<owner>/payload-cms/chart`                          |
| Flux manifests (per env)          | `ghcr.io/<owner>/payload-cms/kustomization/{dev,production}` |

Per-env chart values are **inline in the HelmRelease manifests** (`spec.values`) — they carry no secrets, so no separate values artifacts. (`HelmRelease.spec.valuesFrom[].kind` only accepts `Secret`/`ConfigMap`, not `OCIRepository`.)

## Deployment

- `charts/payload-cms/` — Deployment-only chart. Values surface: `image`, `replicaCount` (**RWO volume ⇒ 1 replica; RWX ⇒ >1**, enforced by a chart `fail` guardrail), `mongodb` connection (secret key ref for `DATABASE_URL`), payload env via `envFromSecret`, `service`, `httproute` (Gateway API) and Traefik `ingressRoute` toggles, `persistence` (`accessMode`/`storageClass`/`size`/`existingClaim`; `.next/cache` stays `emptyDir`), `resources`, probes, hardened `securityContext` (uid/gid 1001, drop ALL caps), `imagePullSecrets`.
- `kubernetes/environments/{dev,production}/` — Namespace + Flux `OCIRepository` (chart, `ref.semver`) + `HelmRelease` with inline `values` + sealed-secret template. Namespaces: `payload-cms-dev` / `payload-cms-production` on cluster `borg`.
- `kubernetes/clusters/borg/` — one-time bootstrap: Flux root `Kustomization` + `OCIRepository` pointing at the kustomization artifacts. `release.yaml` pushes the env manifests; flux pulls them from GHCR.
- MongoDB is cluster-managed and lives outside this repo; the app reaches it through an in-cluster cloudflared tunnel. CI builds reach it via WARP in the runner (DNS: `borg.cluster`, whoami test: `whoami.whoami.svc.borg.cluster`).
- Cluster secrets are sealed with `kubeseal` (controller: `kube-system`; cert: `https://sealed-secrets.borg.external.systems/cert/v1` — **not yet deployed**, so sealed secrets are pending; templates live at `kubernetes/environments/*/sealed-secret.yaml.example`). Runtime app env comes from a Kubernetes Secret; build-time env uses a BuildKit secret mount (see `Dockerfile`).

### One-time GitHub setup (out of scope for automation)

Configured by hand, not by any workflow or script in this repo:

- **GitHub Environments** `dev` and `production` (per-env secrets/vars: `DATABASE_URL`, `PAYLOAD_SECRET`, `CRON_SECRET`, `PREVIEW_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `CF_WARP_ORG`, `CF_WARP_CLIENT_ID`, `CF_WARP_CLIENT_SECRET`). `production` gets **required reviewers** — the async approval gate for `promote-production.yaml`.
- **Branch protection** on `production` (PR-only merges from `dev`).
- **GitHub Pages** publish source for `docs.yaml`.

## Conventions

- TypeScript; follow the existing eslint/prettier config. No new dependencies without justification.
- Nix files: format with `alejandra`, lint with `statix` and `deadnix` (enforced by `nix flake check`).
- Minimal, on-task changes; match existing code style.
- If you change workflows, repo layout, or conventions, update this AGENTS.md and `documentation/`.

## Hard rules

1. Never touch `main`. Work on `dev` only.
2. Never commit secrets (`.env`, `.secrets/`, kubeconfigs).
3. Never make a workflow run automatically — all stay `workflow_dispatch`.
4. Verify with the commands above before declaring work done.

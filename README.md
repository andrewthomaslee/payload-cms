# payload-cms

A Payload CMS 3 + Next.js 16 website shipped as OCI artifacts to Kubernetes — and a reference template for **vibe coding Payload CMS with an AI harness** (OpenCode, Claude Code, Codex).

- **Docs:** <https://docs.bff.netsam.dev> (mkdocs, sourced from `documentation/`)
- **Agent guide:** [AGENTS.md](AGENTS.md)

## Quickstart

```bash
nix develop        # dev shell: node 22, pnpm 10, k8s/helm/oras tooling
cp .env.example .env
pnpm dev           # http://localhost:3000
```

## Branch model

- `dev` — active development; all work lands here.
- `production` — PR-only promotion target (created after the current overhaul).
- `main` — archived legacy, do not use.

## How it ships

Every GitHub Actions workflow is **manually dispatched**; every OCI artifact is tagged `0.1.<N>` (N = commits since git init):

1. **`build-dev`** — builds the Next.js app image (live MongoDB at build time via Cloudflare WARP) → `ghcr.io/<owner>/payload-cms/site/dev`, cosign-signed.
2. **`chart`** — Helm chart → `payload-cms/chart` (`helm push`, helm OCI media types).
3. **`promote-production`** — re-tags a dev image digest → `site/production`, gated by human approval. No rebuild.
4. **`release`** — pushes `kubernetes/environments/{dev,production}` as Flux kustomization OCI artifacts → `payload-cms/kustomization/{dev,production}`.
5. **Flux** on the `borg` cluster pulls those artifacts and applies the environment manifests: `OCIRepository` (chart, semver ref) + `HelmRelease` with **inline values** → the `payload-cms-dev` / `payload-cms-production` namespaces.
6. **`docs`** — mkdocs → GitHub Pages.

### One-time setup (out of scope for this repo's automation)

The following are configured by hand in GitHub, not by any workflow:

- **GitHub Environments** `dev` and `production` (per-env secrets/vars: `DATABASE_URL`, `PAYLOAD_SECRET`, `CRON_SECRET`, `PREVIEW_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `CF_WARP_ORG`, `CF_WARP_CLIENT_ID`, `CF_WARP_CLIENT_SECRET`). `production` gets **required reviewers** — this is the async approval gate before promotion.
- **Branch protection** on `production` (PR-only merges from `dev`).
- **GitHub Pages** publish source set to the `github-pages` environment/branch used by `docs.yaml`.

See [AGENTS.md](AGENTS.md) for the full operating manual and `documentation/` for architecture and decisions.

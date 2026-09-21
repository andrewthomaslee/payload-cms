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
2. **`chart`** — Helm chart + per-env values pushed with oras → `payload-cms/chart`, `payload-cms/chart/values-{dev,production}`.
3. **`promote-production`** — re-tags a dev image digest → `site/production`, gated by human approval (GitHub Environment required reviewers). No rebuild.
4. **Flux** on the `borg` cluster syncs `kubernetes/environments/{dev,production}` (OCIRepository + HelmRelease) into the `payload-cms-dev` / `payload-cms-production` namespaces.
5. **`docs`** — mkdocs → GitHub Pages.

See [AGENTS.md](AGENTS.md) for the full operating manual and `documentation/` for architecture and decisions.

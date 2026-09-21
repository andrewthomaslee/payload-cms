# Manual GitHub Setup (out of scope for automation)

These are configured by hand in GitHub — no workflow or script in this repo manages them.

## GitHub Environments

- **`dev`** — used by `build-dev` and `release` (dev). Secrets: `DATABASE_URL`, `PAYLOAD_SECRET`, `CRON_SECRET`, `PREVIEW_SECRET`, `CF_WARP_ORG`, `CF_WARP_CLIENT_ID`, `CF_WARP_CLIENT_SECRET`. Vars: `NEXT_PUBLIC_SERVER_URL`.
- **`production`** — used by `promote-production` and `release` (production). Same secrets/vars as `dev`, plus **required reviewers**: this is the async human approval gate before any production image push.

## Branch protection

- `production` branch: PR-only merges from `dev` (no direct pushes).

## GitHub Pages

- Publish source configured for the `github-pages` environment used by the `docs` workflow; CNAME `docs.bff.netsam.dev` is set up on the Cloudflare side.

# WARP + Tunnel

MongoDB is cluster-managed and lives outside this repo. Two paths reach it:

## Build time (GitHub Actions runner)

The `build-dev` workflow connects to the `borg` cluster network with Cloudflare WARP (`Boostport/setup-cloudflare-warp`), then Buildx runs with:

- `dns-search = ["borg.cluster"]`
- the host's nameserver discovered from `/etc/resolv.conf`

The build mounts the app environment (including `DATABASE_URL`) as a BuildKit secret (`--mount=type=secret,id=env-file,dst=/app/.env`) because the Next.js build needs a live database connection. A `whoami` check (`whoami.whoami.svc.borg.cluster`) verifies connectivity before building.

## Runtime (in-cluster)

The app pods resolve MongoDB through an in-cluster `cloudflared` tunnel; the connection string is injected from the `mongodb-connection` Secret as `DATABASE_URL` via the chart's `mongodb` values.

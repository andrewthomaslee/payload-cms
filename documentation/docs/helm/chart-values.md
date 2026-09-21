# Chart values

Reference for `charts/payload-cms/values.yaml`.

## Image

| Key                      | Default                                              | Notes                          |
| ------------------------ | ---------------------------------------------------- | ------------------------------ |
| `image.repository`       | `ghcr.io/andrewthomaslee/payload-cms/site/dev`        | App image repo                 |
| `image.tag`              | `latest`                                             | Pin `0.1.N` for reproducibility |
| `image.pullPolicy`       | `IfNotPresent`                                       |                                |
| `imagePullSecrets`       | `[]`                                                 | For private GHCR packages      |

## Scaling & persistence

| Key                       | Default          | Notes                                                        |
| ------------------------- | ---------------- | ------------------------------------------------------------ |
| `replicaCount`            | `1`              | **RWO ⇒ 1 replica.** `replicaCount > 1` requires `ReadWriteMany` (chart fails otherwise) |
| `persistence.enabled`     | `true`           | Media PVC at `/app/public/media`                             |
| `persistence.accessMode`  | `ReadWriteOnce`  | Use `ReadWriteMany` for multiple replicas                    |
| `persistence.storageClass`| `""`             |                                                              |
| `persistence.size`        | `5Gi`            |                                                              |
| `persistence.existingClaim`| `""`            | Bind to an existing PVC instead of creating one              |
| `persistence.subPath`     | `media`          |                                                              |

`.next/cache` is always an `emptyDir` — it is a build cache, not state.

## Environment

| Key                    | Notes                                                                 |
| ---------------------- | --------------------------------------------------------------------- |
| `env`                  | Plain (non-secret) env vars rendered into the container               |
| `envFromSecret`        | Secret with app env (`PAYLOAD_SECRET`, `CRON_SECRET`, `PREVIEW_SECRET`); delivered via `envFrom` |
| `mongodb.enabled`      | Injects `DATABASE_URL` as a single `secretKeyRef` env var             |
| `mongodb.secretName`   | Cluster-managed MongoDB connection secret                             |
| `mongodb.secretKey`    | Key inside that secret (default `DATABASE_URL`)                       |

Never put secrets in `env`.

## Routing

- `ingressRoute.enabled` — Traefik `IngressRoute` (entryPoints, `host`, optional `/admin` basic-auth middleware).
- `httproute.enabled` — Gateway API `HTTPRoute` (parentRefs, hostnames, annotations).

Enable exactly one per environment.

## Hardening

`podSecurityContext` (uid/gid/fsGroup 1001, `runAsNonRoot`, seccomp `RuntimeDefault`) and `securityContext` (drop ALL caps, no privilege escalation) are fixed defaults matching the Dockerfile user; overrides are possible but discouraged.

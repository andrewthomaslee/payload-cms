# Environments

Per-environment configuration lives **inline in the `HelmRelease` manifests** at `kubernetes/environments/{dev,production}/helmrelease.yaml` under `spec.values` — there are no separate values artifacts, because `HelmRelease.spec.valuesFrom[].kind` only accepts `Secret`/`ConfigMap` and the values carry no secrets.

## dev

- Image: `site/dev` (`pullPolicy: Always`, tag `latest` until tags are pinned)
- Persistence: `ReadWriteMany` (multi-replica capable)
- Namespace: `payload-cms-dev`

## production

- Image: `site/production` — only ever the digest promoted by the `promote-production` workflow
- Persistence: `ReadWriteOnce`, single replica
- Namespace: `payload-cms-production`

## Sealed secrets

App runtime secrets (`payload-cms-env`) are sealed secrets. The sealed-secrets controller (namespace `kube-system`) cert at `https://sealed-secrets.borg.external.systems/cert/v1` is **not yet deployed**, so `sealed-secret.yaml.example` files are placeholders. Generate them with `kubeseal` following the instructions in each example file, then add the result to the environment's `kustomization.yaml`.

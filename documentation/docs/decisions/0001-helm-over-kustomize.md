# ADR 0001 — Helm over Kustomize for the app

**Status:** accepted

## Context

The app needs a parameterized deployment (image, replicas, persistence, routing toggles, probes) across two environments. Kustomize patches raw manifests per overlay; Helm templates them from values.

## Decision

Ship a Deployment-only Helm chart (`charts/payload-cms`) and deploy it through a Flux `HelmRelease` with **inline** per-environment values.

## Consequences

- One chart, two small env manifests; the values diff between environments is visible in one file each.
- Values cannot ship as OCI artifacts: `HelmRelease.spec.valuesFrom[].kind` only accepts `Secret`/`ConfigMap`. Inline values (non-secret) + sealed secrets cover the same ground with less machinery.
- Kustomize is still used to package the environment manifests themselves into the `kustomization/{env}` OCI artifacts.

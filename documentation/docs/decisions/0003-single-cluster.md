# ADR 0003 — Single cluster, namespace-per-environment

**Status:** accepted

## Context

dev and production could live on separate clusters or as separate namespaces on one cluster.

## Decision

One Kubernetes cluster, `borg`, with namespaces `payload-cms-dev` and `payload-cms-production`. Flux runs once; the per-env manifests are separate OCI artifacts (`kustomization/{dev,production}`) pulled by separate root `Kustomization`s.

## Consequences

- One Flux installation and one set of controllers to maintain.
- Environment isolation comes from namespaces, not cluster boundaries — acceptable for this project's scale.
- MongoDB is cluster-managed and lives outside this repo; both namespaces reach it through the in-cluster cloudflared tunnel.

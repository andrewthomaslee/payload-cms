# ADR 0004 — Manual-only CI

**Status:** accepted

## Context

Automatic builds on push would burn CI minutes (the app build requires a live MongoDB connection over WARP, so it is not cheap) and would push half-finished work to the registry.

## Decision

Every workflow is `workflow_dispatch` only. Nothing runs on push or PR. The `production` branch is additionally protected (PR-only) by hand in GitHub.

## Consequences

- Registry contents are always intentional.
- Forgetting to dispatch is the failure mode — mitigated by the small number of workflows and their explicit names.
- Versioning (`0.1.<N>` = commits since git init) stays meaningful because tags are only minted on dispatch.

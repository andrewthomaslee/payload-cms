# ADR 0002 — Promote over Rebuild for production images

**Status:** accepted

## Context

Production images could be rebuilt from the `production` branch or copied from the already-approved dev image. Rebuilding means re-running the WARP-connected build (which needs live MongoDB) and risks dev/prod divergence.

## Decision

`promote-production` takes a tag input (`0.1.N`) and `crane copy`s the dev image **by digest** into `site/production`, then signs it. No rebuild, no WARP in the production job.

## Consequences

- The production artifact is bit-for-bit the artifact that was tested in dev.
- The tag is a **manual input**, not derived from the production branch's rev-list count — a production merge would otherwise drift the count and point at the wrong digest.
- The async approval gate is the GitHub Environment `production` required-reviewers setting.

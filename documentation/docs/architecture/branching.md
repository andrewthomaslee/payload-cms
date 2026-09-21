# Branching

| Branch       | Role                                                     |
| ------------ | -------------------------------------------------------- |
| `dev`        | The only working branch. All changes land here.          |
| `production` | PR-only promotion target (`dev` → `production`). Protected by hand in GitHub. |
| `main`       | **Archived.** Never touch, never merge from.             |

The `production` branch is deployed by dispatching the `release` workflow with `environment: production` after the promote workflow has copied the approved image digest.

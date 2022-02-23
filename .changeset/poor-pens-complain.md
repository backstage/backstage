---
'@backstage/plugin-scaffolder-backend': patch
---

- **DEPRECATED** - `OctokitProvider` has been deprecated and will be removed in upcoming versions
  This helper doesn't make sense to be export from the `plugin-scaffolder-backend` and possibly will be moved into the `integrations` package at a later date.
  All implementations have been moved over to a private implementation called `getOctokitOptions` which is then passed to the `Octokit` constructor. If you're using this API you should consider duplicating the logic that lives in `getOctokitOptions` and move away from the deprecated export.

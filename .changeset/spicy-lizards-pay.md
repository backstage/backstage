---
'@backstage/plugin-scaffolder-backend': patch
---

Properly set `ctx.isDryRun` when running actions in dry run mode. Also always log action inputs for debugging purposes when running in dry run mode.

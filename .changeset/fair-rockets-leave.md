---
'@backstage/plugin-scaffolder-backend-module-bitbucket-server': patch
---

Instead of using hardcoded `targetBranch` now fetch the default branch from Bitbucket repository.
This prevents from errors when no `targetBranch` is provided and the default repository branch is different from `master`, for example: `main`.

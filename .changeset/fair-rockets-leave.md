---
'@backstage/plugin-scaffolder-backend-module-bitbucket-server': patch
---

Instead of using hardcoded targetBranch we are fetching the default branch from Bitbucket repository.
This prevents from errors when no targetBranch is provided and the default repository branch is different from `master`, for example: `main`.

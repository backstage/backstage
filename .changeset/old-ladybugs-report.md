---
'@backstage/plugin-scaffolder-backend-module-github': patch
---

Pass `undefined` to some parameters for `createOrUpdateEnvironment` as these values are not always supported in different plans of GitHub

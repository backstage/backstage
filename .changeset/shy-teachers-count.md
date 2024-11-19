---
'@backstage/plugin-scaffolder-backend-module-gitlab': minor
---

**BREAKING**: Upgraded the `gitbeaker` library to version 41. As part of this, the `scopes` parameter to the `gitlab:projectDeployToken:create` is no longer optional, so you will have to pass it a value (for example `['read_repository']`).

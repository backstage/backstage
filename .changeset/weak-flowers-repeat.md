---
'@backstage/plugin-scaffolder-backend-module-gitea': patch
---

- Fix issue for infinite loop when repository already exists
- Log the root cause of error reported by `checkGiteaOrg`

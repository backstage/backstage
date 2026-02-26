---
'@backstage/plugin-scaffolder-backend-module-gitlab': patch
---

Changed `gitlab:group:ensureExists` action to use `Groups.show` API instead of `Groups.search` for checking if a group path exists. This is more efficient as it directly retrieves the group by path rather than searching and filtering results.

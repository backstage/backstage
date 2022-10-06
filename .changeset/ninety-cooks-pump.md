---
'@backstage/plugin-permission-backend': patch
'@backstage/plugin-playlist-backend': patch
'@backstage/plugin-scaffolder-backend': patch
'@backstage/plugin-user-settings-backend': patch
---

Use `IdentityApi.getUserIdentity` instead of `getIdentity` which is deprecated

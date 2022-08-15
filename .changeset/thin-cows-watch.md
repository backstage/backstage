---
'@backstage/plugin-permission-backend': patch
'@backstage/plugin-scaffolder-backend': patch
---

Uptake the `IdentityApi` change to use `getIdentity` instead of `authenticate` for retrieving the logged in users identity.

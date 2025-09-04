---
'@backstage/plugin-auth-backend-module-guest-provider': patch
---

If the Guest user has a corresponding entity in the catalog, the logged in user profile is populated using the `displayName`, `picture` and `email` fields set in the user's catalog entity.

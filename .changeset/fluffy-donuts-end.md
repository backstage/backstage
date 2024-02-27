---
'@backstage/plugin-scaffolder-backend': minor
---

Migrate plugin to use the new auth services.
**BREAKING**: Add a required service discovery to the router options and remove the optional identity from it. Also change the permissions type to be `PermissionsService`.

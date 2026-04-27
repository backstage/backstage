---
'@backstage/plugin-permission-backend': minor
---

Added a `GET /.well-known/backstage/permissions/installed` endpoint that returns the deployment's permission catalog grouped by plugin. Disable with `permission.installedPermissions.enabled: false`.

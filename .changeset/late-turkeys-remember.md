---
'@backstage/plugin-permission-common': patch
---

The `token` option of the `PermissionEvaluator` methods is now deprecated. The options that only apply to backend implementations have been moved to `PermissionsService` from `@backstage/backend-plugin-api` instead.

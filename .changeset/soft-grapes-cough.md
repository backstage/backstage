---
'@backstage/plugin-permission-node': patch
---

The `ServerPermissionClient` has been migrated to implement the `PermissionsService` interface, now accepting the new `BackstageCredentials` object in addition to the `token` option, which is now deprecated. It now also optionally depends on the new `AuthService`.

---
'@backstage/backend-plugin-api': patch
---

Added new `PermissionsRegistryService` that is used by plugins to register permissions, resource types, and rules into the permission system. This replaces the existing `createPermissionIntegrationRouter` from `@backstage/plugin-permission-node`.

---
'@backstage/plugin-catalog-backend': patch
---

Removed deprecated `PermissionAuthorizer` support and the `createPermissionIntegrationRouter` fallback path from `CatalogBuilder`. The `permissionsRegistry` service is now required, and `permissions` is always a `PermissionsService`.

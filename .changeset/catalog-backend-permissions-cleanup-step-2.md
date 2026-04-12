---
'@backstage/plugin-catalog-backend': patch
---

Removed the internal `addPermissions` and `addPermissionRules` methods from `CatalogBuilder`, and removed the `catalogPermissionExtensionPoint` wiring from `CatalogPlugin`. Custom permission rules and permissions should be registered via `coreServices.permissionsRegistry` directly.

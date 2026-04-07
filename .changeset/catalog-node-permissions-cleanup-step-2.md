---
'@backstage/plugin-catalog-node': minor
---

**BREAKING ALPHA**: Removed the deprecated `CatalogPermissionRuleInput`, `CatalogPermissionExtensionPoint`, and `catalogPermissionExtensionPoint` exports. Use `coreServices.permissionsRegistry` directly to register catalog entity permission rules and permissions.

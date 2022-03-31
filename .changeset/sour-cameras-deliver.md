---
'@backstage/plugin-catalog-backend': patch
---

Handle changes to @alpha permission-related types.

- All exported permission rules and conditions now have a `resourceType`.
- `createCatalogConditionalDecision` now expects supplied conditions to have the appropriate `resourceType`.
- `createCatalogPermissionRule` now expects `resourceType` as part of the supplied rule object.
- Introduce new `CatalogPermissionRule` convenience type.

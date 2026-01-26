---
'@backstage/plugin-catalog-node': minor
---

Promoted stable catalog extension points from alpha to main export. The following extension points are now exported from `@backstage/plugin-catalog-node` instead of `@backstage/plugin-catalog-node/alpha`:

- `catalogLocationsExtensionPoint` and `CatalogLocationsExtensionPoint`
- `catalogProcessingExtensionPoint` and `CatalogProcessingExtensionPoint`
- `catalogAnalysisExtensionPoint` and `CatalogAnalysisExtensionPoint`
- `catalogModelExtensionPoint` and `CatalogModelExtensionPoint`

The old alpha exports for these extension points are now deprecated with `@deprecated` markers pointing to the new stable exports. Please update your imports from `@backstage/plugin-catalog-node/alpha` to `@backstage/plugin-catalog-node`.

Note: The `catalogPermissionExtensionPoint`, `CatalogPermissionExtensionPoint`, and `CatalogPermissionRuleInput` remain in alpha as they are deprecated in favor of `coreServices.permissionsRegistry`.

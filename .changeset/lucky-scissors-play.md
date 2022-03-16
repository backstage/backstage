---
'@backstage/plugin-catalog': patch
---

**DEPRECATION**: The `FilteredEntityLayout` and related components have been moved to `@backstage/plugin-catalog-react` and renamed. The original components are now deprecated and should be replaced as follows:

- `FilteredEntityLayout` -> `CatalogFilterLayout`
- `FilterContainer` -> `CatalogFilterLayout.Filters`
- `EntityListContainer` -> `CatalogFilterLayout.Content`

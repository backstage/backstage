---
'@backstage/plugin-catalog': minor
---

**BREAKING** Completely removed the `EntitySystemDiagramCard` component which was deprecated in a previous release. Any remaining references to this component are now broken and should be replaced with `EntityCatalogGraphCard`, which can be imported from package `@backstage/plugin-catalog-graph`.

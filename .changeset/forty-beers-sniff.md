---
'@backstage/core-components': patch
'@backstage/plugin-catalog-graph': patch
---

Added possibility to show arrow heads for graph edges for better understandability.

In order to show arrow heads in the catalog graph page, add `showArrowHeads` attribute to `CatalogGraphPage` component
(typically in `packages/app/src/App.tsx`):

```diff
- <CatalogGraphPage />
+ <CatalogGraphPage showArrowHeads />
```

In order to show arrow heads in entity graphs, add `showArrowHeads` attribute to `EntityCatalogGraphCard` components
(typically multiple occurrences in `packages/app/src/components/catalog/EntityPage.tsx`):

```diff
- <EntityCatalogGraphCard variant="gridItem" height={400} />
+ <EntityCatalogGraphCard variant="gridItem" height={400} showArrowHeads />
```

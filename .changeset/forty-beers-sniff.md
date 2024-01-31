---
'@backstage/core-components': patch
'@backstage/plugin-catalog-graph': patch
---

Added possibility to show arrow heads for graph edges for better understandability.

In order to show arrow heads in the catalog graph page, add `showArrowHeads` attribute to `CatalogGraphPage` component
(typically in `packages/app/src/App.tsx`):

```diff
  <CatalogGraphPage
    initialState={{
      selectedKinds: ['component', 'domain', 'system', 'api', 'group'],
      selectedRelations: [
        RELATION_OWNER_OF,
        RELATION_OWNED_BY,
        RELATION_CONSUMES_API,
        RELATION_API_CONSUMED_BY,
        RELATION_PROVIDES_API,
        RELATION_API_PROVIDED_BY,
        RELATION_HAS_PART,
        RELATION_PART_OF,
        RELATION_DEPENDS_ON,
        RELATION_DEPENDENCY_OF,
      ],
    }}
+   showArrowHeads
  />
```

In order to show arrow heads in entity graphs, add `showArrowHeads` attribute to `EntityCatalogGraphCard` components
(typically multiple occurrences in `packages/app/src/components/catalog/EntityPage.tsx`):

```diff
- <EntityCatalogGraphCard variant="gridItem" height={400} />
+ <EntityCatalogGraphCard variant="gridItem" height={400} showArrowHeads />
```

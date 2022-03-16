---
'@backstage/plugin-catalog-react': patch
---

Added `CatalogFilterLayout`, which replaces `FilteredEntityLayout` from `@backstage/plugin-catalog`, as well as `FilterContainer` and `EntityListContainer`. It is used like this:

```tsx
<CatalogFilterLayout>
  <CatalogFilterLayout.Filters>
    {/* filter drawer, for example <EntityTypePicker /> and friends */}
  </CatalogFilterLayout.Filters>
  <CatalogFilterLayout.Content>
    {/* content view, for example a <CatalogTable /> */}
  </CatalogFilterLayout.Content>
</CatalogFilterLayout>
```

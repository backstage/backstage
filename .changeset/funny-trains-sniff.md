---
'@backstage/plugin-catalog-react': minor
'@backstage/plugin-catalog': minor
---

Added an entity namespace filter and column on the default catalog page.

If you have a custom version of the catalog page, you can add this filter in your CatalogPage code:

```ts
<CatalogFilterLayout>
  <CatalogFilterLayout.Filters>
    <EntityTypePicker />
    <UserListPicker initialFilter={initiallySelectedFilter} />
    <EntityTagPicker />
    /* if you want namespace picker */
    <EntityNamespacePicker />
  </CatalogFilterLayout.Filters>
  <CatalogFilterLayout.Content>
    <CatalogTable columns={columns} actions={actions} />
  </CatalogFilterLayout.Content>
</CatalogFilterLayout>
```

The namespace column can be added using `createNamespaceColumn();`. This is only needed if you customized the columns for CatalogTable.

---
'@backstage/plugin-catalog': patch
---

Added pagination support to `CatalogIndexPage`

`CatalogIndexPage` now offers an optional pagination feature, designed to accommodate adopters managing extensive catalogs. This new capability allows for better handling of large amounts of data.

To activate the pagination mode, simply update your `App.tsx` as follows:

```diff
  const routes = (
    <FlatRoutes>
      ...
-     <Route path="/catalog" element={<CatalogIndexPage />} />
+     <Route path="/catalog" element={<CatalogIndexPage pagination />} />
      ...
```

In case you have a custom catalog page and you want to enable pagination, you need to pass the `pagination` prop to `EntityListProvider` instead.

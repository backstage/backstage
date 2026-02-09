---
'@backstage/plugin-catalog': patch
---

Added `CatalogExportButton`, which adds CSV and JSON export support to the `CatalogIndexPage`.

`CatalogIndexPage` now offers an optional export feature, allowing users to export their current catalog view to CSV or JSON files while respecting the filters applied in the UI.

The export feature is configured via the `exportSettings` prop with `enableExport: true`:

```diff
const routes = (
  <FlatRoutes>
    ...
-     <Route path="/catalog" element={<CatalogIndexPage />} />
+     <Route path="/catalog" element={<CatalogIndexPage exportSettings={{ enableExport: true }} />} />
    ...
```

The feature is implemented via `CatalogExportButton`, which can be embedded directly on custom catalog pages. It supports extensive customization including:

- **Custom export columns**: Configure which entity fields to include in exports
- **Custom export formats**: Add support for custom export types (XML, YAML, etc.) via custom exporter functions
- **Export callbacks**: Handle success and error cases with custom callbacks

For usage examples and advanced customization options, see the [Catalog Customization documentation](https://backstage.io/docs/features/software-catalog/catalog-customization/#export).

Under the hood, exports are streamed directly through the browser for optimal performance and memory efficiency, processing entities page-by-page to minimize memory usage even when exporting large catalogs.

# @backstage/plugin-catalog-backend-module-export

The export backend module for the catalog plugin.

This module adds a `catalog/export` API that can be used with any catalog backend filter enabled to create exports in either JSON or CSV.

To activate the export mode, update your `App.tsx` as follows:

```diff
const routes = (
  <FlatRoutes>
    ...
-     <Route path="/catalog" element={<CatalogIndexPage />} />
+     <Route path="/catalog" element={<CatalogIndexPage enableExport />} />
    ...
```

And add this module to your backend `index.ts`:

```diff
+  backend.add(import('@backstage/plugin-catalog-backend-module-export'));
```

The feature is implemented with a `CatalogExportButton` that can also be embedded manually on a custom `CatalogIndexPage`.

Future improvements:

- Make a `catalogExportExtension` that allows you to register custom formats, including getting available formats from a GET endpoint in the `CatalogExportButton`
- Make exported columns configurable

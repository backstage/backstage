---
'@backstage/plugin-catalog-backend-module-export': patch
'example-backend': patch
'@backstage/plugin-catalog': patch
---

Added CSV and JSON export support to `CatalogIndexPage`.

`CatalogIndexPage` now offers an optional export feature, designed to accommodate users wanting to quickly export their current catalog view to a CSV or Json file.
This new capability allows for easy export of the catalog data, using the filters that are applied in the UI.

To activate the export mode, update your `App.tsx` as follows:

```diff
const routes = (
  <FlatRoutes>
    ...
-     <Route path="/catalog" element={<CatalogIndexPage />} />
+     <Route path="/catalog" element={<CatalogIndexPage enableExport />} />
    ...
```

Besides, install the catalog export backend module in your backend `index.ts`:

```diff
+  backend.add(import('@backstage/plugin-catalog-backend-module-export'));
```

The feature is implemented with a `CatalogExportButton` that can also be embedded manually on custom catalog index pages.
Under the hood this leverages a new `useBackstageSteamedDownload` hook that is leveraged to download files directly through the browser, for optimal file delivery.

Affected packages:

- `catalog` - with new CatalogExportButton
- new `catalog-backend-module-export`
- Example app and example backend

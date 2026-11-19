---
'@backstage/plugin-catalog-react': minor
---

Added `CatalogExportButton`, moved from `@backstage/plugin-catalog`, so it can be used in custom catalog pages. It needs to be rendered inside an `EntityListProvider`. The related types are exported as well: `CatalogExportButtonProps`, `CatalogExportType`, `CatalogExportSettings`, `CatalogExporterConfig`, `CatalogExportSettingsColumn` and `CatalogExporter`. The button texts are under the `catalogExportButton.*` keys of `catalogReactTranslationRef`.

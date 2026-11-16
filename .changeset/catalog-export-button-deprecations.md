---
'@backstage/plugin-catalog': minor
---

Deprecated the `CatalogExportSettings`, `CatalogExporterConfig`, `CatalogExportSettingsColumn` and `CatalogExporter` exports. Import them from `@backstage/plugin-catalog-react` instead.

The export button texts now come from `catalogReactTranslationRef`. If you override the `catalogExportButton.*` keys in `catalogTranslationRef`, move them to `catalogReactTranslationRef`.

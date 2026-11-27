---
'@backstage/plugin-catalog': patch
---

Deprecated the `CatalogExportSettings`, `CatalogExporterConfig`, `CatalogExportSettingsColumn` and `CatalogExporter` exports from both `@backstage/plugin-catalog` and `@backstage/plugin-catalog/alpha`. Import them from `@backstage/plugin-catalog-react` instead.

The export button texts now come from `catalogReactTranslationRef`. If you override the `catalogExportButton.*` keys in `catalogTranslationRef`, move them to `catalogReactTranslationRef`.

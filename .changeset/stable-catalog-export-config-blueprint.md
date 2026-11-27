---
'@backstage/plugin-catalog': minor
---

Custom Catalog exporters can now use the stable `CatalogExportConfigBlueprint` export from `@backstage/plugin-catalog`.

**BREAKING ALPHA**: The Catalog page now accepts export configuration only from the Catalog plugin and its frontend modules. If your extension is registered under another plugin ID, move it into a frontend module with `pluginId: 'catalog'`.

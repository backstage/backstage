---
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-catalog-node': minor
---

Modify `UrlReaderProcessor` to accept a callback function for transforming an entity's namespace before being written to the catalog. expose the `replaceDefaultProcessors` method in the `CatalogProcessingExtenstionPoint`

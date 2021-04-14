---
'example-backend': patch
'@backstage/plugin-catalog-backend': patch
'@backstage/plugin-catalog': patch
'@backstage/plugin-search': patch
---

The `DefaultCatalogCollator` now conditionally uses a pre-configured, local catalog client when deployed in the same process as the catalog. #5316

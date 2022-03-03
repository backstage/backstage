---
'@backstage/plugin-catalog-backend': minor
---

**Breaking**: Removed `entityRef` from `CatalogProcessorRelationResult`. The field is not used by the catalog and relation information is already available inside the `reation` property.

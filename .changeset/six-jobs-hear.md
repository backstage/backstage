---
'@backstage/plugin-catalog-backend': patch
---

Fixed bug in the `DefaultCatalogProcessingEngine` where entities that contained multiple different types of relations for the same source entity would not properly trigger stitching for that source entity.

---
'@backstage/plugin-catalog-backend': minor
---

Added a new `catalog.enableRawJsonResponse` configuration option that avoids JSON deserialization and serialization if possible when reading entities. This can significantly improve the overall performance of the catalog, but it removes the backwards compatibility processing that ensures that both `entity.relation[].target` and `entity.relation[].targetRef` are present in returned entities.

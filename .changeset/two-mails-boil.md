---
'@backstage/catalog-client': minor
---

**BREAKING**: Removed `CatalogClient.getLocationByEntity` and `CatalogClient.getOriginLocationByEntity` which had previously been deprecated. Please use `CatalogApi.getLocationByRef` instead. Note that this only affects you if you were using `CatalogClient` (the class) directly, rather than `CatalogApi` (the interface), since it has been removed from the interface in an earlier release.

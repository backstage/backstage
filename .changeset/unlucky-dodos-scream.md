---
'@backstage/catalog-client': minor
---

Removed `CatalogApi.geLocationByEntity` and `CatalogApi.getOriginLocationByEntity`, and replaced them with `CatalogApi.getLocationByRef`.

If you were using one of the two old methods, you can update your code as follows:

```diff
-const originLocation = catalogApi.getOriginLocationByEntity(entity);
+const originLocation = catalogApi.getLocationByRef(entity.metadata.annotations[ANNOTATION_ORIGIN_LOCATION]!);
-const location = catalogApi.getLocationByEntity(entity);
+const location = catalogApi.getLocationByRef(entity.metadata.annotations[ANNOTATION_LOCATION]!);
```

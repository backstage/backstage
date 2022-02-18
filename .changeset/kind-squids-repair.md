---
'@backstage/plugin-catalog-backend': patch
---

Added `LocationSpec`, which was moved over from `@backstage/catalog-model`.

Added `LocationInput`, which replaced `LocationSpec` where it was used in the `LocationService` and `LocationStore` interfaces. The `LocationInput` type deprecates the `presence` field, which was not being used in those contexts.

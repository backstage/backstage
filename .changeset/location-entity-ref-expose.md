---
'@backstage/catalog-client': minor
---

**BREAKING PRODUCERS**: Added required `entityRef` field to the `Location` type, exposing the stable entity reference for each registered location. Any code that produces `Location` objects must now include this field. Added `updateLocation` method to `CatalogApi` for updating the type and target of an existing location.

---
'@backstage/plugin-catalog-node': minor
---

**BREAKING PRODUCERS**: Added `updateLocation` method to `CatalogService` for updating the type and target of an existing location. Any code that implements `CatalogService` must now provide this method.

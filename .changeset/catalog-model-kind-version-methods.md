---
'@backstage/catalog-model': minor
---

Added `addKindVersion` and `updateKindVersion` methods to `CatalogModelLayerBuilder`, allowing plugins to declare new versions or modify existing versions of a kind without having to re-declare the kind itself. The `versions` array on `updateKind` is now deprecated in favor of these dedicated methods.

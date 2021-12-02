---
'@backstage/catalog-model': patch
---

Added an optional `presence` field to Location spec, which describes whether the target of a location is required to exist or not. It defaults to `'required'`, which is the current behaviour of the catalog.

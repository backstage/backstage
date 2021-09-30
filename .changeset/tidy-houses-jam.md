---
'@backstage/plugin-catalog-backend': minor
---

Add `/entities/by-name/:kind/:namespace/:name/ancestry` to get the "processing parents" lineage of an entity.

This involves a breaking change of adding the method `entityAncestry` to `EntitiesCatalog`.

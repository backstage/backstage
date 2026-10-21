---
'@backstage/catalog-client': patch
---

`streamEntities` no longer asks the catalog backend to compute the total number of matching items, since that count is never part of the streamed result. This also applies to the catalog service in `@backstage/plugin-catalog-node`, which delegates to the client. The `totalItems` option of `StreamEntitiesRequest` is now deprecated and ignored.

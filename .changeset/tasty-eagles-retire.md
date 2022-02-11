---
'@backstage/catalog-client': patch
---

Deprecated the following types used by the catalog client, and created new
corresponding types to make them more consistent:

- `CatalogEntitiesRequest` -> `GetEntitiesRequest`
- `CatalogListResponse` was removed and generally replaced with `GetEntitiesResponse` (which does not use a type parameter argument)
- `CatalogEntityAncestorsRequest`-> `GetEntityAncestorsRequest`
- `CatalogEntityAncestorsResponse` -> `GetEntityAncestorsResponse`

---
'@backstage/catalog-client': minor
---

`CatalogApi.queryEntities` now accepts a `totalItems` option (`'include'` or `'exclude'`, default `'include'`) on initial requests. Pass `'exclude'` to skip the `totalItems` count when the caller doesn't need it.

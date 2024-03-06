---
'@backstage/catalog-client': minor
---

`getEntities` is now implemented in terms of repeated paginated calls to `queryEntities` to avoid server overload. This is backed by a feature detection call, to ensure that the new code path isn't attempted toward servers that do not yet implement the `/entities/by-query` endpoint that was introduced in Backstage v1.12.

The initial implementation has a fixed page size of 1000.

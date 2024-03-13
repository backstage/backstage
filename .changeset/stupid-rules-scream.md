---
'@backstage/catalog-client': minor
---

`getEntities` is now implemented in terms of repeated paginated calls to `queryEntities` to avoid server overload.

NOTE: This requires that your catalog backend is from Backstage release version v1.12 or newer (`@backstage/plugin-catalog-backend` package of version 1.8.0 or newer, introduced on March 14 2023), since that is when the `/entities/by-query` endpoint was introduced. Please update your backend installations accordingly before using this client version.

The initial implementation has a fixed page size of 1000.

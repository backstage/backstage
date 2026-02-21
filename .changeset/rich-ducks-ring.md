---
'@backstage/catalog-client': minor
'@backstage/plugin-catalog-backend': minor
---

Added predicate-based entity filtering via POST /entities/by-query endpoint.

Supports `$all`, `$any`, `$not`, `$exists`, and `$in` operators for expressive entity queries. Integrated into the existing `queryEntities` flow with full cursor-based pagination, permission enforcement, and `totalItems` support.

The catalog client's `queryEntities()` method automatically routes to the POST endpoint when a `query` predicate is provided.

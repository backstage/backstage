---
'@backstage/plugin-catalog-backend': minor
---

Added support for predicate-based filtering on the `/entities/by-refs` endpoint via the `query` field in the request body. Supports `$all`, `$any`, `$not`, `$exists`, `$in`, `$contains`, and `$hasPrefix` operators.

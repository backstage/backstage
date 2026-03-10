---
'@backstage/plugin-catalog-backend': minor
---

Added support for predicate-based filtering on the `/entity-facets` endpoint via a new `POST` method. Supports `$all`, `$any`, `$not`, `$exists`, `$in`, `$contains`, and `$hasPrefix` operators.

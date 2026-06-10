---
'@backstage/plugin-catalog-backend': patch
---

Optimized `entitiesBatch` on PostgreSQL to use `= ANY(array)` instead of `WHERE IN ($1, $2, ...)`. This produces a single stable query plan regardless of batch size, instead of up to 200 different plans that pollute the query plan cache. On PostgreSQL, batching is no longer needed so all entity refs are fetched in a single query.

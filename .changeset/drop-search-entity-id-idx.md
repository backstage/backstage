---
'@backstage/plugin-catalog-backend': patch
---

Dropped the legacy `search_entity_id_idx` index which is now redundant with the covering unique index on `(entity_id, key, value)`. The old index caused the query planner to choose an inefficient scan pattern for catalog list queries with multiple sort fields, leading to severely degraded performance on large catalogs.

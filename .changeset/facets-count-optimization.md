---
'@backstage/plugin-catalog-backend': patch
---

Simplified the entity facets aggregation from `COUNT(DISTINCT entity_id)` to `COUNT(*)`. The unique constraint on `(entity_id, key, value)` guarantees each entity appears at most once per search row group, making the `DISTINCT` unnecessary. This allows the database to use a simpler aggregation plan.

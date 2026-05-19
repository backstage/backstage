---
'@backstage/plugin-catalog-backend-module-incremental-ingestion': patch
---

On PostgreSQL, `WHERE ref IN ($1, $2, ..., $N)` queries on the `ingestion_mark_entities` table now use `= ANY($1)` with a single array parameter instead. This reduces prepared statement bloat in the query plan cache when the number of entity refs varies between calls.

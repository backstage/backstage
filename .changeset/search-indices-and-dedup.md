---
'@backstage/plugin-catalog-backend': patch
---

Added a migration that removes duplicate rows from the `search` table, creates covering indices for improved query performance, and adds a `UNIQUE` constraint on `(entity_id, key, value)`.

This is a long-running migration on large catalogs. On PostgreSQL with millions of search rows, the index creation may take 5-15 minutes per index. During this time, other pods running the previous version will continue to serve traffic normally — the index creation does not block reads or writes. However, if a Kubernetes liveness probe kills the pod before the index build completes, the build is lost and the next startup will start over. On large tables this can repeat indefinitely.

**For large installations**, it is recommended to run the following SQL commands against your PostgreSQL database **before deploying** this version. Each index build takes a few minutes but does not block reads or writes. If these have already completed, the migration will detect the existing indices and skip all work — startup will be instant.

```sql
-- Step 1: Remove duplicate search rows
WITH cte AS (
  SELECT ctid, row_number() OVER (PARTITION BY entity_id, key, value) AS rn
  FROM search
)
DELETE FROM search USING cte WHERE search.ctid = cte.ctid AND cte.rn > 1;

-- Step 2: Create new indices (run each separately)
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS
  search_entity_key_value_idx ON search (entity_id, key, value);
CREATE INDEX CONCURRENTLY IF NOT EXISTS
  search_key_value_entity_idx ON search (key, value, entity_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS
  search_facets_covering_idx ON search (key, original_value, entity_id)
  WHERE original_value IS NOT NULL;

-- Step 3: Drop old indices that are no longer needed
DROP INDEX CONCURRENTLY IF EXISTS search_key_value_idx;
DROP INDEX CONCURRENTLY IF EXISTS search_key_original_value_idx;
```

Also fixed `buildEntitySearch` to remove duplicate output for entities with duplicate array values, and added `ON CONFLICT DO UPDATE` to `syncSearchRows` so that concurrent stitching races are handled gracefully.

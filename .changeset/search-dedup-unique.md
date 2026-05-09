---
'@backstage/plugin-catalog-backend': patch
---

Added a migration that removes duplicate rows from the `search` table and adds a `UNIQUE` constraint on `(entity_id, key, value)`. This prevents future duplicates from concurrent stitching races and enables removing the defensive `DISTINCT` in entity listing queries, which is a prerequisite for the planned query ordering optimizations.

Also fixed `buildEntitySearch` to deduplicate its output (e.g. when an entity has duplicate array values like `tags: ['java', 'java']`), and added `ON CONFLICT DO NOTHING` to the PostgreSQL write path in `syncSearchRows` so that any remaining race-condition duplicates are silently skipped rather than causing errors.

---
'@backstage/plugin-catalog-backend': patch
---

Added a migration that tunes PostgreSQL automatic vacuum thresholds on the `search`, `final_entities`, `relations`, and `refresh_state_references` tables, and fixes column statistics for `entity_id` in the `search` table. This prevents the query planner from falling back to sequential scans when table maintenance falls behind, keeping catalog queries fast on large installations.

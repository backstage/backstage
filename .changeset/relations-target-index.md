---
'@backstage/plugin-catalog-backend': patch
---

Added a missing index on `relations.target_entity_ref`. Several query paths (orphan deletion, entity ancestry, eager pruning) join or filter on this column, but no index existed — causing full sequential scans of the relations table on every invocation. On a production catalog with ~3.5M relation rows, individual lookups were taking ~122ms (full table scan) instead of <1ms (index scan).

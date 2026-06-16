---
'@backstage/plugin-catalog-backend': patch
---

Replaced the delete-all and reinsert pattern for `refresh_state_references` with a diff-based sync that only touches rows that actually changed. This eliminates steady-state write churn, dead tuples, and WAL traffic from the processing path when the set of emitted entities has not changed (the common case). A new migration adds partial unique indices that enforce one reference per (source, target) pair and supersede the old single-column indices, which are dropped.

The previous code used an `OR`-scoped `DELETE` that removed references from all sources to the target entities, not just from the current source. This caused entities with multiple parents to lose valid references, potentially leading to incorrect orphaning. The new sync is strictly scoped to the current source entity and never modifies other sources' references.

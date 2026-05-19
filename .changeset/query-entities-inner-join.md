---
'@backstage/plugin-catalog-backend': minor
---

**BREAKING**: When paginating entities with an order field via `/entities/by-query`, entities that lack the order field are now excluded from both the result set and the `totalItems` count. Previously these entities appeared at the end of the sorted result via `NULLS LAST`, but cursor-based pagination could not actually reach them past the first page — the count over-reported the number of navigable entities. The new behavior aligns the count with what is actually returned.

This also removes the `DISTINCT` deduplication from the sort-field CTE, which is a prerequisite for the planner to use the `(key, value, entity_id)` index in sort order and short-circuit on `LIMIT`. Installations with duplicate search rows should land the search-table deduplication migration before adopting this change.

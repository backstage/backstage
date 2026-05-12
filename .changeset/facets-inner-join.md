---
'@backstage/plugin-catalog-backend': patch
---

Improved the performance of the entity facets endpoint when filters are applied. The filtered entity set is now combined with the search table through an inner join rather than a `WHERE entity_id IN (subquery)`. Results are unchanged; on large catalogs the query planner is able to choose dramatically cheaper plans, with measured improvements ranging from roughly 1.2× on already-fast cases to 7× or more on high-cardinality facets.

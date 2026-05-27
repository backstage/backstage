---
'@backstage/plugin-catalog-backend': patch
---

Split the `queryEntities` list and count into separate queries instead of a multi-reference CTE. When the `filtered` CTE was referenced twice (once for the count, once for the data), PostgreSQL refused to inline it, forcing full materialization of the filtered set before applying `LIMIT`. By running the count as a standalone query, the list CTE is only referenced once, allowing the planner to short-circuit on `LIMIT` and return the first page in milliseconds instead of waiting for the full filtered set to materialize.

The standalone count query also fixes a pre-existing bug where `totalItems` was inflated for entities with multi-valued sort fields (e.g. tags). The old CTE-based count counted search rows, so an entity with 3 tags would be counted 3 times. The new count uses `EXISTS` to count distinct entities, aligning `totalItems` with the number of entities actually reachable through cursor pagination.

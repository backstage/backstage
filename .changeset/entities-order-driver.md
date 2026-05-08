---
'@backstage/plugin-catalog-backend': patch
---

Restructured the entity listing endpoint so that, when a sort field is specified, the search-by-key index drives the query rather than being side-joined onto `final_entities`. This lets PostgreSQL walk the `(key, value, entity_id)` index in already-sorted order and short-circuit on `LIMIT`, reducing typical broad-filter paginated list times from seconds to milliseconds. Behavior change: entities that lack the order field are now excluded from sorted results rather than appearing at the end.

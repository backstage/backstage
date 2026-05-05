---
'@backstage/catalog-client': minor
---

Added `entityFilterOptions` and `resolveEntityFilterValue` exports that enable the `relations.<relationType>` filter syntax when using `filterPredicateToFilterFunction` with catalog entities. This allows filters like `{ "relations.ownedBy": "group:default/my-team" }` to work in-memory with the same semantics as the catalog backend's search table.

---
'@backstage/catalog-client': patch
---

Exported `convertFilterToPredicate`, which converts a legacy `EntityFilterQuery` into an equivalent filter predicate. It now matches the semantics of the legacy filter query parameter more closely: it returns `undefined` rather than a predicate matching nothing when the filter is empty, it skips empty records instead of letting them match everything, and string values take precedence over `CATALOG_FILTER_EXISTS` for the same key.

---
'@backstage/catalog-client': patch
---

Fixed the conversion of legacy filters that happens when a request has both a `filter` and a `query`, so that it matches the semantics of the legacy filter query parameter. Empty filters no longer turn into a predicate that matches nothing, empty records no longer match everything, and string values take precedence over `CATALOG_FILTER_EXISTS` for the same key.

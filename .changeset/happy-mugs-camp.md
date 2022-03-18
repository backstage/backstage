---
'@backstage/plugin-search-common': patch
---

- Introduce `SearchDocument` type. This type contains the subset of `IndexableDocument` properties relevant to the frontend, and is intended to be used for documents returned to the frontend from the search API.
- `SearchResultSet` is now a wrapper for documents of type `SearchDocument`, and is intended to be used in the frontend. This isn't a breaking change, since `IndexableDocument`s are valid `SearchDocument`s, so the old and new types are compatible.
- Introduce `IndexableResultSet` type, which wraps `IndexableDocument` instances in the same way as `SearchResultSet`.

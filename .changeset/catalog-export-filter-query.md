---
'@backstage/plugin-catalog': patch
---

The catalog export button now respects filters that implement `getCatalogQuery`, and sends all filters to the backend as a single predicate query.

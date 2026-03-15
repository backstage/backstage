---
'@backstage/core-compat-api': patch
---

Added a missing dependency on `@backstage/filter-predicates` to `@backstage/core-compat-api`. This fixes package metadata for consumers that use compatibility helpers relying on filter predicate support.

---
'@backstage/plugin-search-backend-module-pg': patch
---

Fixed a bug that could cause orphaned PG connections to accumulate (eventually
exhausting available connections) when errors were encountered earlier in the
search indexing process.

---
'@backstage/plugin-search-backend': patch
'@backstage/plugin-search-backend-node': patch
'@backstage/plugin-search-backend-module-elasticsearch': patch
'@backstage/plugin-search-backend-module-pg': patch
---

Use new `IndexableResultSet` type as return type of query method in `SearchEngine` implementation.

---
'@backstage/plugin-search-backend': patch
'@backstage/plugin-search-backend-module-elasticsearch': patch
'@backstage/plugin-search-backend-module-pg': patch
'@backstage/plugin-search-backend-node': patch
---

The provided search engine now adds a pagination-aware `rank` value to all results.

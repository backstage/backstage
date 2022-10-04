---
'@backstage/plugin-search-backend-node': patch
'@backstage/plugin-search-backend-module-pg': patch
'@backstage/plugin-search-backend-module-elasticsearch': patch
---

The search engine has been updated to take advantage of the `pageLimit` property on search queries. If none is provided, the search engine will continue to use its default value of 25 results per page.

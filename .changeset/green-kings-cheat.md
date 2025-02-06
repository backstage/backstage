---
'@backstage/plugin-catalog-backend-module-github': patch
---

Decreased number of repositories fetched per page by GraphQL query, due to timeouts when running against big organizations.

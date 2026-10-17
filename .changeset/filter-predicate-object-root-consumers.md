---
'@backstage/plugin-catalog-backend': patch
---

Entity and location queries with a primitive value at the root of the filter predicate are now rejected with an "Invalid query" error, rather than "Query must be an object".

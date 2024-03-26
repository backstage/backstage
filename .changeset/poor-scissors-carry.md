---
'@backstage/plugin-auth-backend': patch
'@backstage/plugin-auth-node': patch
---

Only consider entities of kind `User` when using `findCatalogUser` with a filter query, unless an explicit `kind` filter is provided.

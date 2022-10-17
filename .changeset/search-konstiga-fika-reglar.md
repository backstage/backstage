---
'@backstage/plugin-adr-backend': patch
'@backstage/plugin-search-backend-module-elasticsearch': patch
'@backstage/plugin-search-backend-node': patch
'@backstage/plugin-stack-overflow-backend': patch
'@backstage/plugin-techdocs-backend': patch
---

In order to improve the debuggability of the search indexing process, messages logged during indexing are now tagged with a `documentType` whose value corresponds to the `type` being indexed.

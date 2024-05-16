---
'@backstage/plugin-search-backend-node': patch
'@backstage/plugin-search-backend': patch
---

Split backend search plugin startup into "init" and "start" stages to ensure necessary initialization has happened before startup

---
'@backstage/plugin-search-backend-module-elasticsearch': patch
---

Fixed bulk indexing to refresh only the target index instead of all indexes, improving performance in multi-index deployments.

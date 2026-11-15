---
'@backstage/plugin-search-backend-module-pg': patch
---

Avoid recomputing full-text search `tsvector` data for unchanged documents during indexing.

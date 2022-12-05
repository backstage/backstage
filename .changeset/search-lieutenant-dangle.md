---
'@backstage/plugin-search-backend-module-elasticsearch': patch
---

Fixed a bug that prevented indices from being cleaned up under some circumstances, which could have led to shard exhaustion.

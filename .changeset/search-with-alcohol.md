---
'@backstage/plugin-search-backend-module-elasticsearch': minor
'@backstage/plugin-search-backend-module-pg': minor
'@backstage/plugin-search-backend-node': minor
---

The search engine now better handles the case when it receives 0 documents at index-time. Prior to this change, the indexer would replace any existing index with an empty index, effectively deleting it. Now instead, a warning is logged, and any existing index is left alone (preserving the index from the last successful indexing attempt).

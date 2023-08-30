---
'@backstage/plugin-search-backend-module-pg': patch
---

Added `indexerBatchSize` option to be able to control the size of the batches being indexed. Also added a debug log entry to list out all the entities in the batch

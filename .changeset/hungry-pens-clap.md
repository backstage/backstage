---
'@backstage/plugin-search-backend-node': patch
---

Fixed memory leak in `LunrSearchEngine` where the document store grew unbounded across reindexing cycles. The fix replaces the single global `docStore` with per-type document stores that are fully replaced during each indexing cycle, preventing deleted documents from accumulating in memory.

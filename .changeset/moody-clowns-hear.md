---
'@backstage/plugin-catalog-backend': patch
---

Make the processing hash calculation not care about the order of the processors.

This change does not affect the behavior of the catalog, but it will make the processing
hash calculation more robust against changes in the order of processors. This should lead to
more stable processing hashes, which in turn should lead to fewer unnecessary reprocessing
of entities.

After deploying this fix, you may see a period of increased processing and stitching, but
this should stabilize over time as the processing hashes become more consistent.

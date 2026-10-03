---
'@backstage/plugin-catalog-backend': patch
---

Fixed entities disappearing from filtered and sorted catalog queries after a database error during stitching. The final entity and its search index rows are now written together, so a failure part way through is rolled back and retried in full. Previously the entity could be left with a search index that no longer matched it, and because the entity itself looked up to date, every later stitch attempt skipped it. Such an entity stayed readable by direct lookup while missing from list queries that filter or sort, until it was next edited.

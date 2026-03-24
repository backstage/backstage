---
'@backstage/plugin-catalog-backend': patch
---

Fixed a deadlock in the catalog processing loop that occurred when running multiple replicas. The `getProcessableEntities` method used `SELECT ... FOR UPDATE SKIP LOCKED` to prevent concurrent processors from claiming the same rows, but the call was not wrapped in a transaction, so the row locks were released before the subsequent `UPDATE` executed. This allowed multiple replicas to select and update overlapping rows, causing PostgreSQL deadlock errors (code 40P01).

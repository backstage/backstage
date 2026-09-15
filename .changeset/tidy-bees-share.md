---
'@backstage/plugin-catalog-backend': patch
---

Fixed the PostgreSQL search deduplication migration to keep temporary-table operations on a single database connection.

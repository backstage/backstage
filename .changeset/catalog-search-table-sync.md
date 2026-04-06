---
'@backstage/plugin-catalog-backend': patch
---

Reduced search table write churn during stitching by syncing only changed rows instead of doing a full delete and re-insert. On Postgres this uses a single writable CTE, on MySQL a temporary table merge with deadlock retry, and on SQLite the previous bulk replace.

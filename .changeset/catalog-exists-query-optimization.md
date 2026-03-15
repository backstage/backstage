---
'@backstage/plugin-catalog-backend': patch
---

Improved catalog entity filter query performance by switching from `IN (subquery)` to `EXISTS (correlated subquery)` patterns and adding covering database indices. This enables semi-join optimizations and index-only scans on PostgreSQL, significantly reducing query times for large catalogs.

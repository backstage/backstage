---
'@backstage/plugin-catalog-backend': patch
---

Improved catalog entity filter query performance by switching from `IN (subquery)` to `EXISTS (correlated subquery)` patterns. This enables PostgreSQL semi-join optimizations and fixes `NOT IN` NULL-semantics pitfalls by using `NOT EXISTS` instead.

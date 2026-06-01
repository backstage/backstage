---
'@backstage/plugin-catalog-backend': patch
---

Added extended multi-column statistics on `(key, value)` in the `search` table (PostgreSQL only). This tells the query planner about the correlation between the `key` and `value` columns, fixing severe row count estimation errors on compound filter queries. Without this, the planner could choose to materialize and sort thousands of rows instead of using the LIMIT short-circuit index scan — causing 10-40x slower catalog list views when multiple filters are active.

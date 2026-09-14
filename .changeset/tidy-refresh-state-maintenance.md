---
'@backstage/plugin-catalog-backend': patch
---

Lowered PostgreSQL autovacuum and auto-analyze scale factors for the high-churn `refresh_state` table, and immediately refreshed its planner statistics.

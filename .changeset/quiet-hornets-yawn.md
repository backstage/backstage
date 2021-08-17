---
'@backstage/plugin-search-backend-module-pg': patch
---

Correct version requirements on postgres from 11 to 12. Postgres 12 is required
due the use of generated columns.

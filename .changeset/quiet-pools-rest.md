---
'@backstage/backend-defaults': patch
---

Stopped issuing periodic per-plugin database keepalive queries by default and changed the default minimum PostgreSQL and MySQL connection pool size to zero. Idle connections can now be retired after the configured timeout, while explicitly configured pool minimums are preserved. Set `backend.database.keepalive: true` to continue issuing the periodic queries.

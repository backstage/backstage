---
'@backstage/backend-defaults': patch
---

The database manager now attempts to close any database connections in a root lifecycle shutdown hook.

---
'@backstage/backend-defaults': patch
---

Reduced PostgreSQL startup connections when multiple plugins share a database by reusing the database existence check.

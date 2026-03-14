---
'@backstage/plugin-catalog-backend': patch
---

Make the `search` foreign key catalog migration non-blocking on large tables by using batch deletes and PostgreSQL `NOT VALID`/`VALIDATE` to reduce lock duration

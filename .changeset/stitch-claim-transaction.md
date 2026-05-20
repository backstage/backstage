---
'@backstage/plugin-catalog-backend': patch
---

Fixed a race condition in the stitch queue and entity processing claim logic where `SELECT FOR UPDATE SKIP LOCKED` row locks were released before the subsequent timestamp bump, allowing multiple workers to claim the same rows. Both the select and update now run inside a single transaction for MySQL and PostgreSQL.

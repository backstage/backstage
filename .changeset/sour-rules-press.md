---
'@backstage/backend-common': patch
---

Added retries for initial database creation, as well as set minimum connection pool size for the database creation client to 0 and lowered the connection acquisition timeout.

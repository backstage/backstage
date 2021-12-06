---
'@backstage/backend-common': path
---

Each plugin now saves to a separate sqlite database file when `connection.filename` is provided in the sqlite config.
Any existing sqlite database files will be ignored.

---
'@backstage/cli-module-build': patch
---

Fixed the embedded-postgres PID file being written before database initialization, which prevented the database from initializing successfully.

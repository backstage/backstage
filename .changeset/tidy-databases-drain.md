---
'@backstage/cli-module-build': patch
---

Fixed embedded PostgreSQL stopping too early on Ctrl-C during local development. The database now stays available until the backend has finished shutting down. Each development process now cleans up only its own temporary database.

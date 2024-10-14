---
'@backstage/backend-defaults': patch
---

Fix for backend shutdown hanging during local development due to SQLite connection shutdown never resolving.

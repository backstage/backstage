---
'@backstage/plugin-techdocs-backend': patch
---

Fixed issue `syncEntityDocs` that would cause the `/sync` endpoint to be continuously called if the request fails

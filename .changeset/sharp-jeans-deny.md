---
'@backstage/plugin-techdocs-backend': patch
---

Changed `@alpha` behavior of when `permission.enabled=true`: The authorization middleware for the assets endpoint (`/static/docs`) will only check for entity access on HTML document requests. Previously, this would verify access on every asset request.

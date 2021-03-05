---
'@backstage/plugin-app-backend': patch
---

Add a `Cache-Control: no-store` header to the `index.html` response to instruct the browser to not cache the pages.
This is a workaround for a missing `staticFallbackHandler` since an old `index.html` might link to static assets from a previous deployment.

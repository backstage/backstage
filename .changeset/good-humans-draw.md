---
'@backstage/plugin-app-backend': patch
---

Add a `Cache-Control: no-store, max-age=0` header to the `index.html` response to instruct the browser to not cache the pages.
This tells the browser to not serve a cached `index.html` that might link to static assets from a previous deployment that are not available anymore.

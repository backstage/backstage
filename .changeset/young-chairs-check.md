---
'@backstage/core-app-api': patch
---

Apps will now detect when a relative `backend.baseUrl` or `app.baseUrl` is provided and update it to be a full URL. This means that you can provide relative URLs and they will be resolved as expected across the application.

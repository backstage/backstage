---
'@backstage/core-app-api': patch
---

Apps will now rewrite `app.baseUrl` and `backend.baseUrl` to match `location.origin` when `app.baseUrl` is the same as `backend.baseUrl`. This will help reduce the number of front end builds you have to do with a specific config.

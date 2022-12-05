---
'@backstage/core-app-api': patch
---

Apps will now rewrite the `app.baseUrl` configuration to match the current `location.origin`. The `backend.baseUrl` will also be rewritten in the same way when the `app.baseUrl` and `backend.baseUrl` have matching origins. This will reduce the need for separate frontend builds for different environments.

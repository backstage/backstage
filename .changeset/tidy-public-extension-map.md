---
'@backstage/plugin-app-backend': patch
---

Applied `app.publicConfig.allowedExtensions` to the `app.extension` map as well as the `app.extensions` array. Only allowlisted extension IDs are included in unauthenticated configuration payloads, including when broader configuration paths are allowed.

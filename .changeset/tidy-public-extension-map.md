---
'@backstage/plugin-app-backend': patch
---

Applied `app.publicConfig.allowedExtensions` to both array and object forms of `app.extensions`. Only allowlisted extension IDs are included in unauthenticated configuration payloads, including when broader configuration paths are allowed.

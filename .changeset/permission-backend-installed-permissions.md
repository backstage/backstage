---
'@backstage/plugin-permission-backend': minor
---

Added a `POST /authorize/by-name` endpoint. Callers send permission names; the backend hydrates each name to the registered `Permission` (preserving `attributes` and the basic / resource discriminator) before evaluating it through the configured policy. Unknown names resolve to `DENY`. This makes it possible for callers that only know a permission's name — such as the frontend `if` predicate loader — to authorize without fabricating a basic-permission request that strips `attributes.action` and the resource type.

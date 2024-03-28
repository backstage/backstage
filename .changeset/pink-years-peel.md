---
'@backstage/plugin-catalog-backend-module-github': patch
---

GitHub push events now schedule a refresh on entities that have a refresh_key matching the `catalogPath` config itself.
This allows to support a `catalogPath` configuration that uses glob patterns.

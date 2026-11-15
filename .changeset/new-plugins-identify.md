---
'@backstage/frontend-app-api': patch
'@backstage/plugin-app': patch
---

Updated plugin identity handling to use `pluginId`, while preserving support for older plugin instances that only expose `id`.

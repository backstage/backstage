---
'@backstage/backend-plugin-api': minor
---

Added `registerConnection` to plugin and module registration environments, with a public `ConnectionRegistration` type. Plugins can request the experimental connections service using `connectionsServiceRef` from `@backstage/backend-plugin-api/alpha`.

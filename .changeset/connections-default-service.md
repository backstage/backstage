---
'@backstage/backend-defaults': patch
---

Backends created with `createBackend` now provide the experimental connections service by default. Custom backends can install `connectionsServiceFactory` from `@backstage/backend-defaults/alpha`.

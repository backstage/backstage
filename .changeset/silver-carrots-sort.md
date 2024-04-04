---
'@backstage/backend-plugin-api': patch
'@backstage/backend-app-api': patch
---

Added `initialization` option to `createServiceFactory` which defines the initialization strategy for the service. The default strategy mimics the current behavior where plugin scoped services are initialized lazily by default and root scoped services are initialized eagerly.

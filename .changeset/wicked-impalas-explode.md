---
'@backstage/backend-test-utils': patch
---

Internal refactor of `mockServices.httpAuth.factory` to allow it to still be constructed with options, but without declaring options via `createServiceFactory`.

---
'@backstage/backend-test-utils': patch
---

Backends started with `startTestBackend` are now automatically stopped after the each test, unless the `autoStop` option is set to `false`.

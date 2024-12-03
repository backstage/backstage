---
'@backstage/backend-plugin-api': patch
---

The `RootLifecycleService` now has a new `addBeforeShutdownHook` method, and hooks added through this method will run immediately when a termination event is received.

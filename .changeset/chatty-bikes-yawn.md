---
'@backstage/backend-app-api': patch
---

All created backend instances now share a the same `process` exit listeners, and on exit the process will wait for all backend instances to shut down before exiting. This fixes the `EventEmitter` leak warnings in tests.

---
'@backstage/backend-app-api': patch
---

The shutdown signal handlers are now installed as part of the backend instance rather than the lifecycle service, and explicitly cause the process to exit.

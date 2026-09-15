---
'@backstage/frontend-app-api': patch
---

Disposing an app history now removes only its own listener, preserving other history instances and listeners sharing the same underlying history.

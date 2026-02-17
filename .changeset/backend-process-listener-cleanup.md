---
'@backstage/backend-app-api': patch
---

Fixed memory leak by properly cleaning up process event listeners on backend shutdown.

---
'@backstage/backend-app-api': patch
---

Fixed repeated shutdown signals causing the backend to exit before cleanup finishes. Process shutdown also waits for an explicit `backend.stop()` that is already in progress.

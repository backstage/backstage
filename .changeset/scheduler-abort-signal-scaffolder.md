---
'@backstage/plugin-scaffolder-backend': patch
---

The scheduled task that shuts down stale scaffolder tasks now stops when the scheduler aborts it, for example when it times out or the backend shuts down.

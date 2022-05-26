---
'@backstage/backend-tasks': patch
---

Resetting the next run time when a TaskWorker gets restarted. Was only overwriting the schedule settings, but now overwriting the next runtime as well

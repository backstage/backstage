---
'@backstage/backend-tasks': patch
---

Fixed bug in backend TaskWorker, 'next_run_start_at' will be always the least between schedule changes.

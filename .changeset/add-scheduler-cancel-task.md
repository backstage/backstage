---
'@backstage/backend-plugin-api': minor
'@backstage/backend-defaults': patch
---

Added `cancelTask` method to the `SchedulerService` interface and implementation, allowing cancellation of currently running scheduled tasks. For global tasks, the database lock is released and a periodic liveness check aborts the running task function. For local tasks, the task's abort signal is triggered directly. A new `POST /.backstage/scheduler/v1/tasks/:id/cancel` endpoint is also available.

---
'@backstage/backend-tasks': patch
---

The task scheduler now has two new methods: `scheduleLocalTask` and `createScheduledLocalTaskRunner`, which can be used to perform local-only recurring tasks. This can be used to replace usages of `runPeriodically` helpers.

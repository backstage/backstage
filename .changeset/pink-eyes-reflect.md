---
'@backstage/plugin-scaffolder-backend': minor
---

Made shut down stale tasks configurable.

There are two properties exposed:

- `scaffolder.processingInterval` - sets the processing interval for staled tasks.
- `scaffolder.taskTimeoutJanitorFrequency` - sets the task's heartbeat timeout, when to consider a task to be staled.

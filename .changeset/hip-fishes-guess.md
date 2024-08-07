---
'@backstage/backend-plugin-api': patch
'@backstage/backend-defaults': patch
---

The `SchedulerService` now allows tasks with `frequency: { trigger: 'manual' }`. This means that the task will not be scheduled, but rather run only when manually triggered with `SchedulerService.triggerTask`.

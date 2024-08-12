---
'@backstage/backend-tasks': patch
---

The `PluginTaskScheduler` now allows tasks with `frequency: { trigger: 'manual' }`. This means that the task will not be scheduled, but rather run only when manually triggered with `PluginTaskScheduler.triggerTask`.

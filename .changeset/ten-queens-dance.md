---
'@backstage/backend-tasks': minor
---

**BREAKING**: The `TaskDefinition` type has been removed, and replaced by the equal pair `TaskScheduleDefinition` and `TaskInvocationDefinition`. The interface for `PluginTaskScheduler.scheduleTask` stays effectively unchanged, so this only affects you if you use the actual types directly.

Added the method `PluginTaskScheduler.createTaskSchedule`, which returns a `TaskSchedule` wrapper that is convenient to pass down into classes that want to control their task invocations while the caller wants to retain control of the actual schedule chosen.

---
'@backstage/backend-tasks': minor
---

This package is deprecated and will be removed in a near future, follow the instructions below to stop using it:

- `TaskScheduler`: Please migrate to the new backend system, and depend on `coreServices.scheduler` from `@backstage/backend-plugin-api` instead, or use `DefaultSchedulerService` from `@backstage/backend-defaults;
- `TaskRunner`: Please import `SchedulerServiceTaskRunner` from `@backstage/backend-plugin-api` instead;
- `TaskFunction`: Please import `SchedulerServiceTaskFunction` from `@backstage/backend-plugin-api` instead;
- `TaskDescriptor`: Please import `SchedulerServiceTaskDescriptor` from `@backstage/backend-plugin-api` instead;
- `TaskInvocationDefinition`: Please import `SchedulerServiceTaskInvocationDefinition` from `@backstage/backend-plugin-api` instead;
- `TaskScheduleDefinition`: Please import `SchedulerServiceTaskFunction` from `@backstage/backend-plugin-api` instead;
- `TaskScheduleDefinitionConfig`: Please import `SchedulerServiceTaskScheduleDefinitionConfig` from `@backstage/backend-plugin-api` instead;
- `PluginTaskScheduler`: Please use `SchedulerService` from `@backstage/backend-plugin-api` instead (most likely via `coreServices.scheduler`);
- `readTaskScheduleDefinitionFromConfig`: Please import `readSchedulerServiceTaskScheduleDefinitionFromConfig` from `@backstage/backend-plugin-api` instead;
- `HumanDuration`: Import `TypesHumanDuration` from `@backstage/types` instead.

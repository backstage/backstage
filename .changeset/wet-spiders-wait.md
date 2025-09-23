---
'@backstage/plugin-scaffolder-backend': major
---

Removing the deprecated types and interfaces, there's no replacement for these types, and hopefully not currently used as they offer no value with the plugin being on the new backend system and no way to consume them.

Affected types: `CreateWorkerOptions`, `CurrentClaimedTask`, `DatabaseTaskStore`, `DatabaseTaskStoreOptions`, `TaskManager`, `TaskStore`, `TaskStoreCreateTaskOptions`, `TaskStoreCreateTaskResult`, `TaskStoreEmitOptions`, `TaskStoreListEventsOptions`, `TaskStoreRecoverTaskOptions`, `TaskStoreShutDownTaskOptions`, `TaskWorker` and `TemplateActionRegistry`.

---
'@backstage/plugin-scaffolder-backend': minor
---

**DEPRECATIONS**

The following types and implementations have been deprecated, either because they're no longer relevant, or because upcoming changes to the `scaffolder-backend` after `2.0.0` will influence the changes to these API surfaces.

- `CreateWorkerOptions`
- `DatabaseTaskStore`
- `DatabaseTaskStoreOptions`
- `TaskManager`
- `TaskStoreCreateTaskOptions`
- `TaskStoreCreateTaskResult`
- `TaskStoreEmitOptions`
- `TaskStoreListEventsOptions`
- `TaskStoreRecoverTaskOptions`
- `TaskStoreShutDownTaskOptions`

There is no current path off deprecation, these types are going to be removed and rethought with a better way to define workers in the new backend system.

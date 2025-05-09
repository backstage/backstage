---
'@backstage/backend-defaults': minor
---

**BREAKING**: The `DefaultSchedulerService` constructor options now requires `RootLifecycleService`, `HttpRouterService`, and `PluginMetadataService` fields.

The scheduler will register a REST API for listing and triggering tasks. Please see [the scheduler documentation](https://backstage.io/docs/backend-system/core-services/scheduler) for more details about this API.

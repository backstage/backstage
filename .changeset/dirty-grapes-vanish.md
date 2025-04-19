---
'@backstage/backend-defaults': patch
---

The `DefaultSchedulerService` now accepts `HttpRouterService` and `PluginMetadataService` arguments. If you supply a router, the scheduler will register a REST API for listing and triggering tasks.

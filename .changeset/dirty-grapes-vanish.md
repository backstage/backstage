---
'@backstage/backend-defaults': patch
---

The `DefaultSchedulerService` now accepts an `HttpRouterService` argument. If you supply a router, the scheduler will register a REST API for listing and triggering tasks.

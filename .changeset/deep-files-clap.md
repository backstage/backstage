---
'@backstage/backend-defaults': minor
---

The scheduler service now uses the metrics service to create metrics, providing plugin-scoped attribution.

**BREAKING** Most users who use the `schedulerServiceFactory` will not be affected, as the dependency is injected automatically. The `DefaultSchedulerService.create()` method now requires a `metrics: MetricsService` parameter. Users calling this method directly must inject the `MetricsService` dependency.

---
'@backstage/plugin-scaffolder-backend': patch
---

Migrated OpenTelemetry metrics to use the `MetricsService` from `@backstage/backend-plugin-api/alpha` instead of the raw `@opentelemetry/api` meter.

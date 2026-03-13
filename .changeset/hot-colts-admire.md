---
'@backstage/plugin-catalog-backend-module-incremental-ingestion': patch
---

Migrated metrics from direct `@opentelemetry/api` usage to the alpha `MetricsService`, providing plugin-scoped metric attribution. The `@opentelemetry/api` dependency has been removed.

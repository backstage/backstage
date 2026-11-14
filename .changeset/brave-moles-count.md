---
'@backstage/backend-defaults': patch
---

Added an alpha `telemetryRegistryServiceFactory`, which is installed by default in `createBackend`. The default metrics and tracing services now record the instruments they create and the span names they start in this registry.

If you build your own list of service factories and include the alpha `metricsServiceFactory` or `tracingServiceFactory`, you now also need to include `telemetryRegistryServiceFactory` from `@backstage/backend-defaults/alpha`.

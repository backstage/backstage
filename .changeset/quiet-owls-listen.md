---
'@backstage/backend-plugin-api': minor
---

Added an alpha `telemetryRegistryServiceRef` root service that lists the metric instruments and span names that plugins produce through the metrics and tracing services. It stores definitions only, not metric values or span attributes.

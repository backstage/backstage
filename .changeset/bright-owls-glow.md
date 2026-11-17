---
'@backstage/plugin-devtools': patch
---

Added an `OpenTelemetry` tab to DevTools in the new frontend system. It lists the metrics and span names that the backend produces through the Backstage metrics and tracing services. Access is controlled by `devToolsOpenTelemetryReadPermission`.

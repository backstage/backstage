---
'@backstage/backend-plugin-api': patch
'@backstage/backend-defaults': patch
'@backstage/backend-test-utils': patch
---

Added `context` and `propagation` to the alpha `TracingService`. Plugins can bridge OpenTelemetry context across async boundaries via `tracing.propagation.extract(tracing.context.active(), carrier)` followed by `tracing.context.with(ctx, fn)`, and read propagated baggage via `tracing.propagation.getActiveBaggage()` or `tracing.propagation.getBaggage(ctx)`.

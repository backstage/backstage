---
'@backstage/plugin-catalog-backend': patch
---

Improved the bucket boundaries of the `catalog.processing.duration`, `catalog.processors.duration`, `catalog.processing.queue.delay`, `catalog.stitching.duration`, and `catalog.stitching.queue.delay` OpenTelemetry histogram metrics. These metrics record values in seconds, but used the OpenTelemetry default boundaries, which put most values in the first bucket and made percentiles such as p95 and p99 inaccurate. Boundaries below 5 seconds are now added to all five metrics.

The two queue delay metrics keep all the default boundaries, so existing dashboards and alerts for them continue to work. The `catalog.processing.duration`, `catalog.processors.duration`, and `catalog.stitching.duration` metrics keep the default boundaries up to 1000, but no longer have the 2500, 5000, 7500, and 10000 boundaries. Dashboards and alerts for these three metrics that use `le` values up to `1000` continue to work, but ones that use `le="2500"` or higher must be updated.

---
'@backstage/plugin-catalog-backend': patch
---

Improved the bucket boundaries of the `catalog.processing.duration`, `catalog.processors.duration`, `catalog.processing.queue.delay`, `catalog.stitching.duration`, and `catalog.stitching.queue.delay` OpenTelemetry histogram metrics. These metrics record values in seconds, but used the OpenTelemetry default boundaries, which put most values in the first bucket and made percentiles such as p95 and p99 inaccurate. Boundaries below 5 seconds are now added. The default boundaries up to 1000 are kept, so existing dashboards and alerts continue to work. The boundaries 2500, 5000, 7500, and 10000 are removed.

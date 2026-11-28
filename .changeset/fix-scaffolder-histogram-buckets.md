---
'@backstage/plugin-scaffolder-backend': patch
---

Improved the bucket boundaries of the `scaffolder.task.duration` and `scaffolder.step.duration` OpenTelemetry histogram metrics. These metrics record values in seconds, but used the OpenTelemetry default boundaries, which put most values in the first bucket and made percentiles such as p95 and p99 inaccurate. Boundaries below 5 seconds are now added to both metrics.

The `scaffolder.task.duration` metric keeps all the default boundaries, so existing dashboards and alerts for it continue to work. The `scaffolder.step.duration` metric keeps the default boundaries up to 1000, but no longer has the 2500, 5000, 7500, and 10000 boundaries. Dashboards and alerts for this metric that use `le` values up to `1000` continue to work, but ones that use `le="2500"` or higher must be updated.

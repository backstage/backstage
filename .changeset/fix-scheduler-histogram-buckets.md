---
'@backstage/backend-defaults': patch
---

Improved the bucket boundaries of the `backend_tasks.task.runs.duration` OpenTelemetry histogram metric. This metric records values in seconds, but used the OpenTelemetry default boundaries, which put most values in the first bucket and made percentiles such as p95 and p99 inaccurate. Boundaries below 5 seconds are now added. All the default boundaries are kept, so existing dashboards and alerts continue to work.

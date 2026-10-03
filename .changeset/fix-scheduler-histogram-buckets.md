---
'@backstage/backend-defaults': minor
---

**BREAKING** This change alters the bucket boundaries of the `backend_tasks.task.runs.duration` OpenTelemetry histogram metric. If you have dashboards or alerts that depend on a boundary that this change removes (e.g. `le="25"`) for this metric, they will need to be updated.

Previously this metric used OpenTelemetry's default bucket boundaries, which are calibrated for milliseconds. Since the metric records values in seconds, all typical scheduled task durations were crammed into the first few buckets, making percentile calculations (p50, p95, p99) unreliable. Explicit second-scale boundaries are now used to produce accurate distributions.

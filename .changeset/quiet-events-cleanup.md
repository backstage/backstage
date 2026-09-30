---
'@backstage/plugin-events-backend': patch
---

Fixed event cleanup exhausting database connections when expired events accumulate. Cleanup now drains events in bounded batches with database statement timeouts, respects cancellation, and limits each run's duration.

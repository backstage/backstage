---
'@backstage/plugin-catalog-backend': patch
---

Improved stitch queue semantics to prevent overlapping stitches for the same entity. New stitch requests that arrive while a stitch is in progress now only update the ticket (not the timestamp), so the in-progress worker is not interrupted. When the worker completes and detects a pending re-stitch, the queue entry becomes immediately eligible for pickup instead of waiting for the timeout period.

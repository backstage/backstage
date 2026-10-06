---
'@backstage/plugin-catalog-backend': patch
---

Improved deferred stitching reliability by preserving queued work during entity deletion and fencing expired stitching attempts when work is reclaimed. Updated workers no longer interrupt a newer worker's lease when completing stale work. During mixed-version rollouts, old workers can still shorten these leases and cause redundant attempts; MySQL also retains its existing best-effort protection against overlapping writes.

MySQL deadlocks no longer allow the entity and its search index to diverge. PostgreSQL and MySQL now retry the entire publication transaction promptly, rechecking whether the attempt is still current. If retries are exhausted, queued work remains available for recovery after the stitching timeout.

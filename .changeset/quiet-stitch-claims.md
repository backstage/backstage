---
'@backstage/plugin-catalog-backend': patch
---

Improved deferred stitching reliability by preserving queued work during entity deletion and rejecting expired stitching attempts when updated workers reclaim the work. Updated workers check both their ticket and captured lease before removing completed work, preserving reclaimed leases even when the reclaiming worker is an older version. During mixed-version rollouts, old workers can still disrupt queue ownership and cause redundant attempts; MySQL also retains its existing best-effort protection against overlapping writes.

MySQL deadlocks no longer allow the entity and its search index to diverge. PostgreSQL and MySQL now retry the entire publication transaction promptly, rechecking whether the attempt is still current. If retries are exhausted, queued work remains available for recovery after the stitching timeout.

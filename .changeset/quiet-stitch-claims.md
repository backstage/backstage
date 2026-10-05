---
'@backstage/plugin-catalog-backend': patch
---

Improved deferred stitching reliability by preserving queued work during entity deletion and fencing expired stitching attempts when work is reclaimed. Stale completion no longer interrupts a newer worker's lease.

Fixed MySQL deadlock handling during transactional stitching so a failed publication is retried in full instead of allowing the entity and its search index to diverge.

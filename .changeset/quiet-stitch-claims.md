---
'@backstage/plugin-catalog-backend': patch
---

Improved deferred stitching reliability by preserving queued work during entity deletion and fencing expired stitching attempts when work is reclaimed. Stale completion no longer interrupts a newer worker's lease.

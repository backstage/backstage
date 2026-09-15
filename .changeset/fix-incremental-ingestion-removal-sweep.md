---
'@backstage/plugin-catalog-backend-module-incremental-ingestion': patch
---

Fixed a bug where entities could become permanently invisible to the incremental ingestion removal sweep.

Previously, staleness was determined by comparing the current ingestion cycle against the immediately preceding cycle's bookkeeping records, which are pruned shortly after each cycle completes. If a removal was rejected (for example by `rejectRemovalsAbovePercentage` or `rejectEmptySourceCollections`) or the cycle was ended early (for example via the `cancel` or `start` APIs) in that one cycle, the bookkeeping needed to detect that removal on a later cycle was already gone, so the stale entities were never removed again, even though they no longer existed in the upstream source.

Staleness is now determined by comparing the current cycle directly against a running record of every entity each provider currently owns, so entities are correctly detected as removable regardless of how many cycles have passed since they last matched. When you upgrade, this record is populated once from your existing catalog data, so no manual action is needed.

If you've been running incremental ingestion, you may already have orphaned entities in your catalog that this fix will remove on the affected providers' next cycle.

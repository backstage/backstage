---
'@backstage/plugin-catalog-backend': minor
---

Removed the immediate mode stitching strategy. All stitching now uses the deferred mode, which processes entities asynchronously via a worker queue. If your configuration includes `catalog.stitchingStrategy.mode: 'immediate'`, it will be ignored with a deprecation warning. The `pollingInterval` and `stitchTimeout` settings continue to work as before.

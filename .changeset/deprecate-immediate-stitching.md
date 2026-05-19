---
'@backstage/plugin-catalog-backend': patch
---

Deprecated immediate mode stitching (`catalog.stitchingStrategy.mode: 'immediate'`). A warning is now logged on startup when immediate mode is configured. Immediate mode will be removed in the next Backstage release. Migrate to deferred mode (the default) by removing the `stitchingStrategy` configuration or setting `mode: 'deferred'`.

---
'@backstage/plugin-catalog-backend': patch
---

Reject non-positive stitching polling intervals and lease durations at startup to prevent continuous polling and immediate lease expiry. Configuration errors identify the setting that needs correction.

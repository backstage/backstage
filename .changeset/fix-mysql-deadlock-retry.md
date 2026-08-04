---
'@backstage/plugin-catalog-backend': patch
---

Fixed a potential MySQL deadlock during concurrent entity processing by retrying the `updateProcessedEntity` transaction on deadlock errors.

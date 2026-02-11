---
'@backstage/plugin-catalog-backend': patch
---

Fixed O(n²) performance bottleneck in `buildEntitySearch` `traverse()` by replacing `Array.some()` linear scan with a `Set` for O(1) duplicate path key detection.

---
'@backstage/plugin-catalog-backend': patch
---

Fixed a bug where a single broken target in a Location entity's `spec.targets` would silently drop all other valid targets. Individual target failures are now isolated so that successful targets still produce their entities.

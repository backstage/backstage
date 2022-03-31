---
'@backstage/plugin-catalog-backend': patch
---

Fixed an issue where sometimes entities would have stale relations "stuck" and
not getting removed as expected, after the other end of the relation had stopped
referring to them.

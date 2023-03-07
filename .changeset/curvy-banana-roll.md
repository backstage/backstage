---
'@backstage/plugin-badges-backend': patch
---

Fixes a bug where the badge endpoint would return a 401 even if the authMiddleware was disabled.

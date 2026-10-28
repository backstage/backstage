---
'@backstage/core-plugin-api': patch
---

Preserved the legacy `AlertApi`, `AlertMessage`, and `alertApiRef` exports when removing their counterparts from `@backstage/frontend-plugin-api`. Existing plugins can continue posting alerts through the legacy API.

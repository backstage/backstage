---
'@backstage/frontend-defaults': patch
'@backstage/frontend-app-api': patch
'@backstage/cli': patch
---

Deprecated new frontend system config setting `app.experimental.packages` to just `app.packages`. The old config will continue working for the time being, but may be removed in a future release.

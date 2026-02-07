---
'@backstage/frontend-defaults': patch
'@backstage/frontend-app-api': patch
'@backstage/cli': patch
---

Completely removed support for the deprecated `app.experimental.packages` configuration. Replace existing usage directly with `app.packages`.

---
'@backstage/core-components': patch
'@backstage/app-defaults': minor
'@backstage/core-app-api': minor
'@backstage/plugin-auth-backend': patch
'@backstage/test-utils': minor
---

Introduce a new global config parameter, `auth.enableExperimentalRedirectFlow`. When enabled, auth will happen with an in-window redirect flow rather than through a popup window.

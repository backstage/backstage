---
'@backstage/core-components': minor
'@backstage/core-plugin-api': minor
'@backstage/plugin-gitops-profiles': minor
'@backstage/app-defaults': minor
'@backstage/core-app-api': minor
'@backstage/plugin-auth-backend': minor
'@backstage/test-utils': minor
---

Introduce a new global config parameter, "enableExperimentalRedirectFlow" When enabled, instead of having a popup window where the authentication takes place, backstage will redirect to the authentication backend plugin, followed by a redirect back to the backstage frontend after authentication takes place.

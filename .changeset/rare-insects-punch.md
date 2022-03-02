---
'@backstage/app-defaults': minor
'@backstage/core-app-api': minor
'@backstage/core-components': minor
'@backstage/core-plugin-api': minor
'@backstage/test-utils': minor
'@backstage/plugin-user-settings': minor
---

**BREAKING**: Removed deprecated `auth0AuthApiRef`, `oauth2ApiRef`, `samlAuthApiRef` and `oidcAuthApiRef` as these APIs are too generic to be useful. Instructions for how to migrate can be found at [https://backstage.io/docs/api/deprecations#generic-auth-api-refs](https://backstage.io/docs/api/deprecations#generic-auth-api-refs).

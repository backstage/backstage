---
'@backstage/plugin-auth-backend-module-google-provider': patch
---

Added support for the new shared `additionalScopes` configuration. In addition, the `openid`, `userinfo.email`, and `userinfo.profile` scopes have been set to required and will always be present.

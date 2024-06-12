---
'@backstage/plugin-auth-backend-module-okta-provider': patch
---

Added support for the new shared `additionalScopes` configuration, which means it can now also be specified as an array. In addition, the `openid`, `email`, `profile`, and `offline_access` scopes have been set to required and will always be present.

---
'@backstage/plugin-auth-backend-module-oidc-provider': minor
---

**BREAKING**: The `scope` config option have been removed and replaced by the standard `additionalScopes` config. In addition, `openid`, `profile`, and `email` scopes have been set to required and will always be present.

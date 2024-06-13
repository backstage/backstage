---
'@backstage/plugin-auth-backend-module-pinniped-provider': patch
---

**BREAKING**: The `scope` config option have been removed and replaced by the standard `additionalScopes` config. In addition, the `openid`, `pinniped:request-audience`, `username`, and `offline_access` scopes have been set to required and will always be present.

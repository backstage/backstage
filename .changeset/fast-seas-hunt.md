---
'@backstage/plugin-auth-backend-module-cloudflare-access-provider': patch
---

Use the email from `cfIdentity` instead of `claims` when constructing user profile in order to support Cloudflare Service Tokens.

---
'@backstage/plugin-auth-backend': patch
---

Fixed bug in oidc refresh handler, if token endpoints response on refresh request does not contain a scope, the requested scope is used.

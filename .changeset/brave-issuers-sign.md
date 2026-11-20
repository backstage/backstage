---
'@backstage/backend-defaults': patch
'@backstage/plugin-auth-backend': patch
---

Added an experimental `backend.auth.experimentalIssuerClaims` configuration option. When enabled, plugin-to-plugin tokens and the limited user tokens sent along with on-behalf-of requests include an `iss` (issuer) claim set to the external base URL of the issuing plugin. Backends on this version can make on-behalf-of requests regardless of whether the auth backend has the option enabled, so you can upgrade all backends first and enable the option afterwards. Only enable the option once every backend in your deployment has been upgraded to a version that supports it.

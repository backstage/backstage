---
'@backstage/backend-defaults': patch
'@backstage/plugin-auth-backend': patch
---

Added an experimental `auth.experimentalUserIdentityProofIssuer` configuration option to the auth backend. When enabled, the limited user tokens that backends send along with on-behalf-of requests include an `iss` (issuer) claim set to the external base URL of the auth backend. Only enable the option once every backend in your deployment has been upgraded to a version of `@backstage/backend-defaults` that supports it, otherwise on-behalf-of requests from backends running older versions will fail.

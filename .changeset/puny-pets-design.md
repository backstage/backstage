---
'@backstage/plugin-auth-backend-module-vmware-cloud-provider': patch
'@backstage/plugin-auth-backend-module-microsoft-provider': patch
'@backstage/plugin-auth-backend-module-oidc-provider': patch
---

Updated the authenticator to use the new `OAuthAuthenticatorResponse` type for `authenticate` and `refresh` return values, allowing the user profile to be optional when the access token targets a different resource.

---
'@backstage/plugin-auth-backend-module-oidc-provider': patch
'@backstage/plugin-auth-node': patch
---

Fixed a potential issue when using the Backstage's `PassportOAuthAuthenticatorHelper` to implement a custom OAuth Authenticator. The issue occurs during the start stage of the authorization process when the custom `passport.Strategy` calls the `error()` to propagate an error message. Because the `error` function wasn't being set Backstage would throw a `this.error is not a function` error thus hiding the original cause.

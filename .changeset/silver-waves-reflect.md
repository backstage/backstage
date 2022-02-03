---
'@backstage/plugin-auth-backend': patch
---

Added custom `callbackUrl` support for multiple providers. `v0.8.0` introduced this change for `github`, and now we're adding the same capability to the following providers: `atlassian, auth0, bitbucket, gitlab, google, microsoft, oauth2, oidc, okta, onelogin`.

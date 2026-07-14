---
'@backstage/plugin-auth-backend-module-auth0-provider': patch
---

Added `screen_hint` and `login_hint` parameter forwarding for the Auth0 authentication provider.
When these parameters are present in the OAuth start request query string, they
are forwarded to Auth0's `/authorize` endpoint. This allows callers to guide
users to the signup or login screen (`screen_hint=signup`) and pre-fill the
email field (`login_hint=user@example.com`) during invitation flows.

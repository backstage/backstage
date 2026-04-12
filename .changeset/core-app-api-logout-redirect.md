---
'@backstage/core-app-api': patch
'@backstage/plugin-app': patch
---

The default auth implementation now checks for a `logoutUrl` in the logout response body. If the auth provider returns one (e.g. Auth0 federated logout), the browser is redirected to that URL to clear the provider's session cookies. This is backward compatible — providers that return an empty response are unaffected.

---
'@backstage/plugin-auth-backend': patch
---

Updates the OAuth2 Proxy provider to require less infrastructure configuration.

The auth result object of the OAuth2 Proxy now provides access to the request headers, both through the `headers` object as well as `getHeader` method. The existing logic that parses and extracts the user information from ID tokens is deprecated and will be removed in a future release. See the OAuth2 Proxy provider documentation for more details.

The OAuth2 Proxy provider now also has a default `authHandler` implementation that reads the display name and email from the incoming request headers.

---
'@backstage/plugin-auth-backend-module-pinniped-provider': patch
---

Fixed a bug when refreshing ID tokens: now when the audience query parameter is passed to the refresh endpoint, the provider will perform an RFC 8693 token exchange to get a valid ID token for the specified audience.

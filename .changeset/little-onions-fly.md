---
'@backstage/plugin-permission-backend': patch
'@backstage/plugin-search-backend': patch
---

Use `getBearerTokenFromAuthorizationHeader` from `@backstage/plugin-auth-node` instead of the deprecated `IdentityClient` method.

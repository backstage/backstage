---
'@backstage/plugin-auth-backend-module-auth0-provider': patch
---

The Auth0 provider now includes the configured domain in the cache key used for profiles fetched during token refresh, so that environments pointing at different Auth0 tenants no longer share cached profile entries.

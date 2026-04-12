---
'@backstage/plugin-auth-backend-module-auth0-provider': patch
---

Added `createAuth0Authenticator` factory function that accepts a `CacheService` to cache Auth0 profile API responses for 1 minute during token refreshes. This avoids hitting Auth0 rate limits on repeated page refreshes. The module now uses the cached variant by default. The existing `auth0Authenticator` export remains available for use without caching.

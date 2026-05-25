---
'@backstage/plugin-auth-node': minor
---

Added optional `programmaticRefresh` method to `AuthProviderRouteHandlers` for refreshing upstream tokens without HTTP request/response ceremony. OAuth providers created via `createOAuthRouteHandlers` implement this automatically. `OAuthEnvironmentHandler` delegates to the correct environment handler. The `frameHandler` now supports a `cimd_approval` flow for obtaining upstream refresh tokens during CIMD/DCR session approval.

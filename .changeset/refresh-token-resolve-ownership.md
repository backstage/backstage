---
'@backstage/plugin-auth-backend': patch
---

Fixed an issue where refreshing an OAuth access token did not re-resolve user ownership claims from the catalog, leaving stale ownership information in user info responses. Refreshed access tokens now also include updated ownership claims when `auth.omitIdentityTokenOwnershipClaim` is set to `false`, and token refresh requests will be rejected without revoking the refresh token if ownership resolution fails.

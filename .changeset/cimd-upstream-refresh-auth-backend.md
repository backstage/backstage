---
'@backstage/plugin-auth-backend': minor
---

CIMD and DCR offline sessions are now backed by upstream auth provider refresh tokens. When a user approves a CIMD/DCR session that requests `offline_access`, they are redirected to the upstream auth provider to obtain an independent refresh token for that session. On every subsequent token refresh, the session is validated against the upstream provider - if the user has been deactivated or their session revoked upstream, the refresh fails and the session is deleted.

Upstream refresh tokens are protected by a split-knowledge encryption scheme: the encrypted token is stored on the client, while the decryption key is stored in the database. Neither side alone can reconstruct the upstream refresh token.

This is a breaking change for existing CIMD/DCR offline sessions - they will be rejected on next refresh and users will need to re-authenticate.

New configuration:

- `auth.experimentalRefreshToken.signInProviderId`: The auth provider ID to use for upstream validation (e.g., `"google"`, `"oidc"`). Required when `offline_access` scope is used.

New callback URL that must be registered with the upstream auth provider:

- `{auth.baseUrl}/v1/sessions/upstream-callback`

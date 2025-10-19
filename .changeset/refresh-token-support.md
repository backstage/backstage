---
'@backstage/plugin-auth-backend': minor
---

Added support for refresh tokens (offline access) alongside Backstage identity tokens. This feature enables long-lived sessions for dynamic client registration and device authorization flows.

Key features:

- Refresh tokens are issued when `offline_access` scope is requested during OAuth authorization
- Automatic token rotation on each refresh for enhanced security
- Configurable token lifetime (default: 30 days) and maximum rotation lifetime (default: 1 year)
- Per-user limit of 20 refresh tokens with LRU eviction
- One refresh token per OIDC client (new tokens replace old ones)
- Automatic cleanup of expired tokens with stochastic background processing
- Tokens are stored securely using scrypt hashing

Configuration example:

```yaml
auth:
  refreshToken:
    tokenLifetime: '30 days'
    maxRotationLifetime: '1 year'
```

Database: A new `offline_sessions` table has been added to store refresh token sessions.

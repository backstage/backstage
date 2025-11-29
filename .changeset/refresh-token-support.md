---
'@backstage/plugin-auth-backend': minor
---

Added support for refresh tokens (offline access) for long-lived sessions in the dynamic client registration flow. Refresh tokens are issued when the `offline_access` scope is requested during OAuth authorization, with automatic token rotation on each refresh. Tokens are stored securely using `scrypt` hashing in a new `offline_sessions` database table.

Some configuration is available, but not mandatory, for example:

```yaml
auth:
  refreshToken:
    tokenLifetime: '30 days'
    maxRotationLifetime: '1 year'
```

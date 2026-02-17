---
'@backstage/plugin-auth-backend': patch
---

Removed the `auth.experimentalDynamicClientRegistration.tokenExpiration` config option. DCR tokens now use the default 1 hour expiration.

If you need longer-lived access, use refresh tokens via the `offline_access` scope instead. DCR clients should already have the `offline_access` scope available. Enable refresh tokens by setting:

```yaml
auth:
  experimentalRefreshToken:
    enabled: true
```

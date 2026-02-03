---
'@backstage/plugin-auth-backend': minor
---

Added experimental support for refresh tokens via the `auth.experimentalRefreshToken.enabled` configuration option. When enabled, clients can request the `offline_access` scope to receive refresh tokens that can be used to obtain new access tokens without re-authentication.

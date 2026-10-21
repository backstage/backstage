---
'@backstage/plugin-auth-backend': patch
---

Added a `POST /v1/offline-sessions/revoke` endpoint that lets other backend services revoke all offline sessions (refresh tokens) of a user. The endpoint only accepts service credentials, records an audit event, and is only available when `auth.experimentalRefreshToken.enabled` is set.

User entity refs of new offline sessions are now stored in lowercase, so that sessions are reliably matched to their user.

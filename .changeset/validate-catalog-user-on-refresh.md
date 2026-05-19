---
'@backstage/plugin-auth-backend': patch
---

Refresh token usage now verifies that the user's catalog entity still exists before issuing a new access token. If the user has been removed from the catalog, the refresh is rejected and the session is revoked. Transient catalog errors reject the refresh but preserve the session for retry. This check can be disabled by setting `auth.experimentalRefreshToken.dangerouslyDisableCatalogPresenceCheck` to `true`.

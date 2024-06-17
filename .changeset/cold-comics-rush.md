---
'@backstage/backend-app-api': patch
'@backstage/plugin-auth-backend': patch
---

Limited user tokens will no longer include the `ent` field in its payload. Ownership claims will now be fetched from the user info service.

NOTE: Limited tokens issued prior to this change will no longer be valid. Users may have to clear their browser cookies in order to refresh their auth tokens.

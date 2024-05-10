---
'@backstage/backend-app-api': patch
'@backstage/plugin-auth-backend': patch
---

Limited user tokens will no longer include the `ent` field in its payload. Ownership claims will now be fetched from the user info service.

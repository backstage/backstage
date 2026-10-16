---
'@backstage/plugin-auth-backend': patch
---

Fixed an issue where refreshing an OAuth access token did not re-resolve user group memberships from the catalog, leaving stale ownership claims in user info responses.

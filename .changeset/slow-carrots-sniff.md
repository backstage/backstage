---
'@backstage/plugin-catalog-backend-module-msgraph': minor
---

Improve performance when loading users via group membership.
Users data is now loaded from a paged query, rather than having to make an extra call per user to load each user's profiles.

Note, there are still additional per user calls made to load user avatars

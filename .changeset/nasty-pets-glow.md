---
'@backstage/plugin-org': patch
---

Added `relations.memberof` filter to the catalog api call in `MemberListCard` to avoid fetching all the User entity kinds from catalog-backend.

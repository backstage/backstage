---
'@backstage/plugin-org': patch
---

Added relations.memberof filter to the catalog api call in MemberListCard to avoid fetching the whole User kind entity from catalog-backend.

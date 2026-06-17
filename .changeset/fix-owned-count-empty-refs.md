---
'@backstage/plugin-catalog-react': patch
---

Fixed an issue where the "Owned" count in `UserListPicker` would display the total number of catalog entities instead of 0 when the logged-in user has no ownership entity refs. The empty `relations.ownedBy` filter was being silently dropped by the catalog client, causing the backend to return all entities with no ownership filter applied.

This was a regression introduced in #22131, which removed an explicit `ownershipEntityRefs?.length === 0` guard that had been present since #20339.

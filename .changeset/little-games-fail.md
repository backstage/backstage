---
'@backstage/plugin-org': patch
---

Added `relationType` property to EntityMembersListCard component that allows for display users related to a group via some other relationship aside from `memberOf`.

Also, as a side effect, the `relationsType` property has been deprecated in favor of a more accurately named `relationAggregation` property.

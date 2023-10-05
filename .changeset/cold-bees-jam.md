---
'@backstage/plugin-org': patch
---

Fixed the display of OwnershipCard with aggregated relations by loading relations when getting children of entity.
This allows the already existing recursive method to work properly when children of entity have children themselves.

---
'@backstage/plugin-scaffolder': patch
---

Added default ordering to the `EntityPicker` (and therefore `OwnerPicker`) so that catalog results are returned in a stable alphabetical order even when `catalog.enableRelationsCompatibility` is disabled.

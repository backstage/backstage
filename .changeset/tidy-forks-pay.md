---
'@backstage/plugin-permission-node': patch
---

Added a new `createPermissionResourceRef` utility that encapsulates the constants and types related to a permission resource types. The `createConditionExports` and `createPermissionRule` functions have also been adapted to accept these references as arguments, deprecating their older counterparts.

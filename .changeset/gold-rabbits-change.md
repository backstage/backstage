---
'@backstage/plugin-permission-node': patch
---

Added a new `PermissionRuleset` type that encapsulates a lookup function for permission rules, which can be created by the new `PermissionsRegistryService` via the `getPermissionRuleset` method. The `createConditionTransformer` and `createConditionAuthorizer` functions have been adapted to receive these accessors as arguments, with their older counterparts being deprecated.

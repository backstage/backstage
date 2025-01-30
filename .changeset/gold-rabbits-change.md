---
'@backstage/plugin-permission-node': patch
---

Added a new `PermissionRuleAccessor` type that encapsulates a lookup function for permission rules, which can be created by the new `PermissionsRegistryService` via the `getRuleAccessor` method. The `createConditionTransformer` and `createConditionAuthorizer` functions have been adapted to receive these accessors as arguments, with their older counterparts being deprecated.

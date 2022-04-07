---
'@backstage/plugin-permission-common': patch
---

Added `PermissionEvaluator`, which will replace the existing `PermissionAuthorizer` interface. This new interface provides stronger type safety and validation by splitting `PermissionAuthorizer.authorize()` into two methods:

- `authorize()`: Used when the caller requires a definitive decision.
- `authorizeConditional()`: Used when the caller can optimize the evaluation of any conditional decisions. For example, a plugin backend may want to use conditions in a database query instead of evaluating each resource in memory.

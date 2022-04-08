---
'@backstage/plugin-permission-node': minor
---

**BREAKING:** `ServerPermissionClient` now implements `PermissionEvaluator`, which moves out the capabilities for evaluating conditional decisions from `authorize()` to `authorizeConditional()` method.

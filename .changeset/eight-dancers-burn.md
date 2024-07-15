---
'@backstage/plugin-permission-common': minor
---

**BREAKING**: Removed the deprecated and unused `token` option from `EvaluatorRequestOptions`. The `PermissionsClient` now has its own `PermissionClientRequestOptions` type that declares the `token` option instead.

---
'@backstage/plugin-permission-common': minor
---

Refactor api types into more specific, decoupled names.

- **BREAKING:**
  - Renamed `AuthorizeDecision` to `EvaluatePermissionResponse`
  - Renamed `AuthorizeQuery` to `EvaluatePermissionRequest`
  - Renamed `AuthorizeRequest` to `EvaluatePermissionRequestBatch`
  - Renamed `AuthorizeResponse` to `EvaluatePermissionResponseBatch`
  - Renamed `Identified` to `IdentifiedPermissionMessage`
- Add `PermissionMessageBatch` helper type
- Add `ConditionalPolicyDecision`, `DefinitivePolicyDecision`, and `PolicyDecision` types from `@backstage/plugin-permission-node`

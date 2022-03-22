---
'@backstage/plugin-permission-node': minor
---

**BREAKING:**

- Rename `PolicyAuthorizeQuery` to `PolicyQuery`
- Remove `PolicyDecision`, `DefinitivePolicyDecision`, and `ConditionalPolicyDecision`. These types are now exported from `@backstage/plugin-permission-common`

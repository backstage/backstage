---
'@backstage/plugin-permission-node': minor
---

**BREAKING**: Cleaned up the `PolicyQueryUser` type:

- `token` — **Removed.** Was previously deprecated in favor of `credentials` with `coreServices.auth`.
- `expiresInSeconds` — **Removed.** Was previously deprecated.
- `identity` — **Removed.** Was previously deprecated in favor of `info`.
- `info` — **Deprecated.** Still required and populated for now; will be made optional and then removed in a future release.
- `credentials` — Unchanged.

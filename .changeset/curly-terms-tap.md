---
'@backstage/plugin-permission-node': minor
---

_Breaking_ The `PermissionPolicy#handle` function now must handle a `BackstageUserIdentity` or `BackstageServerIdentity`. If you are implementing a `PermissionPolicy`, you will need to update it.

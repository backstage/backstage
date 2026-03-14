---
'@backstage/plugin-permission-react': patch
---

The `PermissionApi.authorize()` method now accepts arrays of permission requests, and permission checks made in the same tick are batched into a single call to the permission backend.

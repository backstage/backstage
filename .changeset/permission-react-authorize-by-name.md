---
'@backstage/plugin-permission-react': patch
---

`IdentityPermissionApi` now exposes an `authorizeByName` method that authorizes a permission identified only by its registered `name`. Calls made in the same tick are batched into a single request against the permission backend's `/authorize/by-name` route, mirroring how `authorize` already batches.

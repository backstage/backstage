---
'@backstage/plugin-permission-node': patch
---

Add `ServerPermissionClient`, which implements `PermissionAuthorizer` from @backstage/plugin-permission-common. This implementation skips authorization entirely when the supplied token is a valid backend-to-backend token, thereby allowing backend-to-backend systems to communicate without authorization.

The `ServerPermissionClient` should always be used over the standard `PermissionClient` in plugin backends.

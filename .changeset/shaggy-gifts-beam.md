---
'@backstage/plugin-permission-common': patch
---

Fixed an issue causing `PermissionClient` to throw an error when authorizing basic permissions with the `permission.EXPERIMENTAL_enableBatchedRequests` config enabled.

---
'@backstage/plugin-permission-node': patch
---

Add endpoints for permission aggregation

`createPermissionIntegrationRouter` now has an additional optional `permission` parameter, which takes a list of `Permission`s. If provided, these permissions will be available for aggregation by anyone who calls the `/.well-known/backstage/permissions/permission-list` endpoint.

Similarly, a serializable version of the permission rules are available for aggregation at the `/.well-known/backstage/permissions/permission-rule-list` endpoint.

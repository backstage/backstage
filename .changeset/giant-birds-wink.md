---
'@backstage/plugin-permission-node': patch
---

Added a new endpoint for aggregating permission metadata from a plugin backend: `/.well-known/backstage/permissions/metadata`

By default, the metadata endpoint will return information about the permission rules supported by the plugin. Plugin authors can also provide an optional `permissions` parameter to `createPermissionIntegrationRouter`. If provided, these `Permission` objects will be included in the metadata returned by this endpoint. The `permissions` parameter will eventually be required in a future breaking change.

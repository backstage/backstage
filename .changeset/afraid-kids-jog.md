---
'@backstage/plugin-permission-node': patch
---

The returned router from `createPermissionIntegrationRouter` is now mutable, allowing for permissions and resources to be added after creation of the router.

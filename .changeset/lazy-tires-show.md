---
'@backstage/plugin-permission-backend': minor
'@backstage/plugin-permission-common': minor
'@backstage/plugin-permission-node': minor
---

Fixed an issue causing the `PermissionClient` to exhaust the request body size limit too quickly when making many requests.

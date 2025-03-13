---
'@backstage/plugin-permission-node': minor
---

**BREAKING** The `ServerPermissionClient` can no longer be instantiated with a `tokenManager` and must instead be instantiated with an `auth` service. If you are still on the legacy backend system, use `createLegacyAuthAdapters()` from `@backstage/backend-common` to create a compatible `auth` service.

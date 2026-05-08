---
'@backstage/backend-defaults': patch
---

Added the alpha `rootPermissionsRegistryServiceFactory` and wired the per-plugin `permissionsRegistry` so its `addPermissions` and `addResourceType` calls also forward each registration into the root permission registry. This gives the permission backend a single in-process source of truth for hydrating permission names without proxying to the owning plugin per request.

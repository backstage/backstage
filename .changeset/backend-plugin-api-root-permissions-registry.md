---
'@backstage/backend-plugin-api': patch
---

Added the alpha `RootPermissionsRegistryService` and `rootPermissionsRegistryServiceRef`, a deployment-wide aggregate of permissions registered by individual plugins. The permission backend uses this to hydrate a permission name into the registered `Permission` (with its `attributes` and resource type) without fanning out to other plugins.

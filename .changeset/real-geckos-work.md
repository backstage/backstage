---
'@backstage/plugin-permission-common': minor
---

- Add `PermissionAuthorizer` interface matching `PermissionClient` to allow alternative implementations like the `ServerPermissionClient` in @backstage/plugin-permission-node.

Breaking Changes:

- Remove "api" suffixes from constructor parameters in PermissionClient

```diff
  const { config, discovery } = options;
-  const permissionClient = new PermissionClient({ discoveryApi: discovery, configApi: config });
+  const permissionClient = new PermissionClient({ discovery, config });
```

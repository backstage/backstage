---
'@backstage/plugin-permission-react': minor
---

Breaking Changes:

- Remove "api" suffixes from constructor parameters in IdentityPermissionApi.create

```diff
  const { config, discovery, identity } = options;
-  const permissionApi = IdentityPermissionApi.create({
-    configApi: config,
-    discovery: discoveryApi,
-    identity: identityApi
-  });
+  const permissionApi = IdentityPermissionApi.create({ config, discovery, identity });
```

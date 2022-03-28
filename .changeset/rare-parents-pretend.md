---
'@backstage/create-app': patch
---

Use `ServerPermissionClient` instead of `PermissionAuthorizer`.

Apply the following to `packages/backend/src/types.ts`:

```diff
- import { PermissionAuthorizer } from '@backstage/plugin-permission-common';
+ import { ServerPermissionClient } from '@backstage/plugin-permission-node';

  export type PluginEnvironment = {
    ...
    discovery: PluginEndpointDiscovery;
    tokenManager: TokenManager;
    scheduler: PluginTaskScheduler;
-   permissions: PermissionAuthorizer;
+   permissions: ServerPermissionClient;
  };
```

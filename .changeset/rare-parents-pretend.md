---
'@backstage/create-app': patch
---

Accept `PermissionEvaluator` together with the deprecated `PermissionAuthorizer`.

Apply the following to `packages/backend/src/types.ts`:

```diff
- import { ServerPermissionClient } from '@backstage/plugin-permission-node';
+ import {
+  PermissionAuthorizer,
+  PermissionEvaluator,
+ } from '@backstage/plugin-permission-common';

  export type PluginEnvironment = {
    ...
    discovery: PluginEndpointDiscovery;
    tokenManager: TokenManager;
    scheduler: PluginTaskScheduler;
-   permissions: ServerPermissionClient;
+   permissions: PermissionEvaluator | PermissionAuthorizer;
  };
```

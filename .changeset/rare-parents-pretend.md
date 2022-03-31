---
'@backstage/create-app': patch
---

Use `PermissionEvaluator` instead of `PermissionAuthorizer`.

Apply the following to `packages/backend/src/types.ts`:

```diff
- import { PermissionAuthorizer } from '@backstage/plugin-permission-common';
+ import { PermissionEvaluator } from '@backstage/plugin-permission-common';

  export type PluginEnvironment = {
    ...
    discovery: PluginEndpointDiscovery;
    tokenManager: TokenManager;
    scheduler: PluginTaskScheduler;
-   permissions: PermissionAuthorizer;
+   permissions: PermissionEvaluator;
  };
```

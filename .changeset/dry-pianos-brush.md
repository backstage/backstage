---
'@backstage/create-app': patch
---

Incorporate usage of the tokenManager into the backend created using `create-app`.

In existing backends, update the `PluginEnvironment` to include a `tokenManager`:

```diff
// packages/backend/src/types.ts

...
import {
  ...
+ TokenManager,
} from '@backstage/backend-common';

export type PluginEnvironment = {
  ...
+ tokenManager: TokenManager;
};
```

Then, create a `ServerTokenManager`. This can either be a `noop` that requires no secret and validates all requests by default, or one that uses a secret from your `app-config.yaml` to generate and validate tokens.

```diff
// packages/backend/src/index.ts

...
import {
  ...
+ ServerTokenManager,
} from '@backstage/backend-common';
...

function makeCreateEnv(config: Config) {
  ...
  // CHOOSE ONE
  // TokenManager not requiring a secret
+ const tokenManager = ServerTokenManager.noop();
  // OR TokenManager requiring a secret
+ const tokenManager = ServerTokenManager.fromConfig(config);

  ...
  return (plugin: string): PluginEnvironment => {
    ...
-   return { logger, cache, database, config, reader, discovery };
+   return { logger, cache, database, config, reader, discovery, tokenManager };
  };
}
```

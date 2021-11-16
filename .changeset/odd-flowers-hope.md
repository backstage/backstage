---
'example-backend': patch
'@backstage/backend-common': patch
'@backstage/create-app': patch
'@backstage/plugin-catalog-backend': minor
'@backstage/plugin-techdocs-backend': minor
---

Create a TokenManager interface and ServerTokenManager implementation to generate and validate server tokens for authenticated backend-to-backend API requests.

**BREAKING** `DefaultCatalogCollator` and `DefaultTechDocsCollator` now require a `tokenManager` to be passed in the `options` argument.

In your backend, update the `PluginEnvironment` to include a `tokenManager`:

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

Finally, pull the `tokenManager` from the search plugin environment and pass it to both collators.

```diff
// packages/backend/src/plugins/search.ts

...
export default async function createPlugin({
  ...
+ tokenManager,
}: PluginEnvironment) {
  ...
  indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
    collator: DefaultCatalogCollator.fromConfig(config, {
      discovery,
+     tokenManager,
    }),
  });

  indexBuilder.addCollator({
    defaultRefreshIntervalSeconds: 600,
    collator: DefaultTechDocsCollator.fromConfig(config, {
      discovery,
      logger,
+     tokenManager,
    }),
  });

  ...
}
```

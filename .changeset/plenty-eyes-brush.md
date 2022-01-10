---
'@backstage/create-app': patch
---

Add permissions to create-app's PluginEnvironment

`CatalogEnvironment` now has a `permissions` field, which means that a permission client must now be provided as part of `PluginEnvironment`. To apply these changes to an existing app, add the following to the `makeCreateEnv` function in `packages/backend/src/index.ts`:

```diff
  // packages/backend/src/index.ts

+ import { ServerPermissionClient } from '@backstage/plugin-permission-node';

  function makeCreateEnv(config: Config) {
    ...
+   const permissions = ServerPerimssionClient.fromConfig(config, {
+     discovery,
+     tokenManager,
+   });

    root.info(`Created UrlReader ${reader}`);

    return (plugin: string): PluginEnvironment => {
      ...
      return {
        logger,
        cache,
        database,
        config,
        reader,
        discovery,
        tokenManager,
        scheduler,
+       permissions,
      };
    }
  }
```

And add a permissions field to the `PluginEnvironment` type in `packages/backend/src/types.ts`:

```diff
  // packages/backend/src/types.ts

+ import { PermissionAuthorizer } from '@backstage/plugin-permission-common';

  export type PluginEnvironment = {
    ...
+   permissions: PermissionAuthorizer;
  };
```

[`@backstage/plugin-permission-common`](https://www.npmjs.com/package/@backstage/plugin-permission-common) and [`@backstage/plugin-permission-node`](https://www.npmjs.com/package/@backstage/plugin-permission-node) will need to be installed as dependencies:

```diff
  // packages/backend/package.json

+   "@backstage/plugin-permission-common": "...",
+   "@backstage/plugin-permission-node": "...",
```

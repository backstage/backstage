---
'@backstage/create-app': patch
---

Add permissions to create-app's PluginEnvironment

`CatalogEnvironment` now has a `permissions` field. This means that the environment parameter passed to `CatalogBuilder.create` in your Backstage backend needs to contain a `permissions` of type `ServerPermissionClient`. To apply these changes to an existing app, add the following to the `makeCreateEnv` function in `packages/backend/src/index.ts`.

```diff
  // packages/backend/src/index.ts

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

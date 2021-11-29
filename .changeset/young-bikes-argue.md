---
'@backstage/plugin-catalog-backend': minor
---

**BREAKING** `DefaultCatalogCollator` has a new required option `tokenManager`. See the create-app changelog for how to create a `tokenManager` and add it to the `PluginEnvironment`. It can then be passed to the collator in `createPlugin`:

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

  ...
}
```

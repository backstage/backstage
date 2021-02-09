---
'@backstage/create-app': patch
---

Pass on plugin database management instance that is now required by the scaffolder plugin.

To apply this change to an existing application, add the following to `src/plugins/scaffolder.ts`:

```diff
export default async function createPlugin({
  logger,
  config,
+  database,
}: PluginEnvironment) {

// ...omitted...

  return await createRouter({
    preparers,
    templaters,
    publishers,
    logger,
    config,
    dockerClient,
    entityClient,
+    database,
  });
}
```

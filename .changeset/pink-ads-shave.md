---
'@backstage/plugin-scaffolder': minor
'@backstage/plugin-scaffolder-backend': minor
---

The scaffolder has been updated to support the new `v1beta2` template schema which allows for custom template actions!

See documentation for more information how to create and register new template actions.

**Breaking changes**

The backend scaffolder plugin now needs a `UrlReader` which can be receieved from the PluginEnvironment.

The following change is required in `backend/src/plugins/scaffolder.ts`

```diff
 export default async function createPlugin({
   logger,
   config,
   database,
+  reader,
 }: PluginEnvironment): Promise<Router> {

  // omitted code

  return await createRouter({
    preparers,
    templaters,
    publishers,
    logger,
    config,
    dockerClient,
    database,
    catalogClient,
+   reader,
  });
```

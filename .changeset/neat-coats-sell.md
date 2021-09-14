---
'@backstage/create-app': patch
---

This change adds an API endpoint for requesting a catalog refresh at `/refresh`, which is activated if a `CatalogProcessingEngine` is passed to `createRouter`.
The creation of the router has been abstracted behind the `CatalogBuilder` to simplify usage and future changes. The following **changes are required** to your `catalog.ts` for the refresh endpoint to function.

```diff
-  import {
-    CatalogBuilder,
-    createRouter,
-  } from '@backstage/plugin-catalog-backend';
+  import { CatalogBuilder } from '@backstage/plugin-catalog-backend';

  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    const builder = await CatalogBuilder.create(env);
-    const {
-      entitiesCatalog,
-      locationAnalyzer,
-      processingEngine,
-      locationService,
-    } = await builder.build();
+   const { processingEngine, router } = await builder.build();
    await processingEngine.start();

-   return await createRouter({
-     entitiesCatalog,
-     locationAnalyzer,
-     locationService,
-     logger: env.logger,
-     config: env.config,
-   });
+   return router;
  }
```

---
'@backstage/plugin-catalog-backend': patch
'@backstage/create-app': patch
---

This release enables the new catalog processing engine which is a major milestone for the catalog!

This update makes processing more scalable across multiple instances, adds support for deletions and ui flagging of entities that are no longer referenced by a location.

**Changes Required** to `catalog.ts`

```diff
-import { useHotCleanup } from '@backstage/backend-common';
 import {
   CatalogBuilder,
-  createRouter,
-  runPeriodically
+  createRouter
 } from '@backstage/plugin-catalog-backend';
 import { Router } from 'express';
 import { PluginEnvironment } from '../types';

 export default async function createPlugin(env: PluginEnvironment): Promise<Router> {
-  const builder = new CatalogBuilder(env);
+  const builder = await CatalogBuilder.create(env);
   const {
     entitiesCatalog,
     locationsCatalog,
-    higherOrderOperation,
+    locationService,
+    processingEngine,
     locationAnalyzer,
   } = await builder.build();

-  useHotCleanup(
-    module,
-    runPeriodically(() => higherOrderOperation.refreshAllLocations(), 100000),
-  );
+  await processingEngine.start();

   return await createRouter({
     entitiesCatalog,
     locationsCatalog,
-    higherOrderOperation,
+    locationService,
     locationAnalyzer,
     logger: env.logger,
     config: env.config,
```

As this is a major internal change we have taken some precaution by still allowing the old catalog to be enabled by keeping your `catalog.ts` in it's current state.
If you encounter any issues and have to revert to the previous catalog engine make sure to raise an issue immediately as the old catalog engine is deprecated and will be removed in a future release.

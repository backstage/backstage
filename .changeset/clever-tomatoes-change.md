---
'@backstage/plugin-scaffolder': patch
'@backstage/plugin-scaffolder-backend': minor
---

# Stateless scaffolding

The scaffolder has been redesigned to be horizontally scalable and to persistently store task state and execution logs in the database.

Each scaffolder task is given a unique task ID which is persisted in the database.
Tasks are then picked up by a `TaskWorker` which performs the scaffolding steps.
Execution logs are also persisted in the database meaning you can now refresh the scaffolder task status page without losing information.

The task status page is now dynamically created based on the step information stored in the database.
This allows for custom steps to be displayed once the next version of the scaffolder template schema is available.

The task page is updated to display links to both the git repository and to the newly created catalog entity.

Component registration has moved from the frontend into a separate registration step executed by the `TaskWorker`. This requires that a `CatalogClient` is passed to the scaffolder backend instead of the old `CatalogEntityClient`.

Make sure to update `plugins/scaffolder.ts`

```diff
 import {
   CookieCutter,
   createRouter,
   Preparers,
   Publishers,
   CreateReactAppTemplater,
   Templaters,
-  CatalogEntityClient,
 } from '@backstage/plugin-scaffolder-backend';

+import { CatalogClient } from '@backstage/catalog-client';

 const discovery = SingleHostDiscovery.fromConfig(config);
-const entityClient = new CatalogEntityClient({ discovery });
+const catalogClient = new CatalogClient({ discoveryApi: discovery })

 return await createRouter({
   preparers,
   templaters,
   publishers,
   logger,
   config,
   dockerClient,
-  entityClient,
   database,
+  catalogClient,
 });
```

As well as adding the `@backstage/catalog-client` packages as a dependency of your backend package.

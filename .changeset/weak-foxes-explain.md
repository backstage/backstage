---
'@backstage/create-app': patch
---

**BREAKING CHANGE**

The Scaffolder and Catalog plugins have been migrated to partially require use of the [new composability API](https://backstage.io/docs/plugins/composability). The Scaffolder used to register its pages using the deprecated route registration plugin API, but those registrations have been removed. This means you now need to add the Scaffolder plugin page to the app directly.

The Catalog plugin has also been migrated to use an [external route reference](https://backstage.io/docs/plugins/composability#binding-external-routes-in-the-app) to dynamically link to the create component page. This means you need to migrate the catalog plugin to use the new extension components, as well as bind the external route.

Apply the following changes to `packages/app/src/App.tsx`:

```diff
-import { Router as CatalogRouter } from '@backstage/plugin-catalog';
+import {
+  catalogPlugin,
+  CatalogIndexPage,
+  CatalogEntityPage,
+} from '@backstage/plugin-catalog';
+import { scaffolderPlugin, ScaffolderPage } from '@backstage/plugin-scaffolder';

# The following addition to the app config allows the catalog plugin to link to the
# component creation page, i.e. the scaffolder. You can chose a different target if you want to.
 const app = createApp({
   apis,
   plugins: Object.values(plugins),
+  bindRoutes({ bind }) {
+    bind(catalogPlugin.externalRoutes, {
+      createComponent: scaffolderPlugin.routes.root,
+    });
+  }
 });

# Apply these changes within FlatRoutes. It is important to have migrated to using FlatRoutes
# for this to work, if you haven't done that yet, see the previous entries in this changelog.
-  <Route
-    path="/catalog"
-    element={<CatalogRouter EntityPage={EntityPage} />}
-  />
+  <Route path="/catalog" element={<CatalogIndexPage />} />
+  <Route
+    path="/catalog/:namespace/:kind/:name"
+    element={<CatalogEntityPage />}
+  >
+    <EntityPage />
+  </Route>
   <Route path="/docs" element={<DocsRouter />} />
+  <Route path="/create" element={<ScaffolderPage />} />
```

The scaffolder has been redesigned to be horizontally scalable and to persistently store task state and execution logs in the database. Component registration has moved from the frontend into a separate registration step executed by the `TaskWorker`. This requires that a `CatalogClient` is passed to the scaffolder backend instead of the old `CatalogEntityClient`.

The default catalog client comes from the `@backstage/catalog-client`, which you need to add as a dependency in `packages/backend/package.json`.

Once the dependency has been added, apply the following changes to`packages/backend/src/plugins/scaffolder.ts`:

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

See the `@backstage/scaffolder-backend` changelog for more information about this change.

---
'@backstage/create-app': patch
---

Migrated away from using deprecated routes and router components at top-level in the app, and instead use routable extension pages.

To apply this change to an existing app, make the following changes to `packages/app/src/App.tsx`:

Update imports and remove the usage of the deprecated `app.getRoutes()`.

```diff
-import { Router as DocsRouter } from '@backstage/plugin-techdocs';
+import { TechdocsPage } from '@backstage/plugin-techdocs';
 import { CatalogImportPage } from '@backstage/plugin-catalog-import';
-import { Router as TechRadarRouter } from '@backstage/plugin-tech-radar';
-import { SearchPage as SearchRouter } from '@backstage/plugin-search';
-import { Router as SettingsRouter } from '@backstage/plugin-user-settings';
+import { TechRadarPage } from '@backstage/plugin-tech-radar';
+import { SearchPage } from '@backstage/plugin-search';
+import { UserSettingsPage } from '@backstage/plugin-user-settings';
+import { ApiExplorerPage } from '@backstage/plugin-api-docs';
 import { EntityPage } from './components/catalog/EntityPage';
 import { scaffolderPlugin, ScaffolderPage } from '@backstage/plugin-scaffolder';


 const AppProvider = app.getProvider();
 const AppRouter = app.getRouter();
-const deprecatedAppRoutes = app.getRoutes();
```

As well as update or add the following routes:

```diff
   <Route path="/create" element={<ScaffolderPage />} />
-  <Route path="/docs" element={<DocsRouter />} />
+  <Route path="/docs" element={<TechdocsPage />} />
+  <Route path="/api-docs" element={<ApiExplorerPage />} />
   <Route
     path="/tech-radar"
-    element={<TechRadarRouter width={1500} height={800} />}
+    element={<TechRadarPage width={1500} height={800} />}
   />
   <Route path="/catalog-import" element={<CatalogImportPage />} />
-  <Route
-    path="/search"
-    element={<SearchRouter/>}
-  />
-  <Route path="/settings" element={<SettingsRouter />} />
-  {deprecatedAppRoutes}
+  <Route path="/search" element={<SearchPage />} />
+  <Route path="/settings" element={<UserSettingsPage />} />
```

If you have added additional plugins with registered routes or are using `Router` components from other plugins, these should be migrated to use the `*Page` components as well. See [this commit](https://github.com/backstage/backstage/commit/abd655e42d4ed416b70848ffdb1c4b99d189f13b) for more examples of how to migrate.

For more information and the background to this change, see the [composability system migration docs](https://backstage.io/docs/plugins/composability).

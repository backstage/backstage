---
'@backstage/create-app': patch
---

Migrate to using `FlatRoutes` from `@backstage/core` for the root app routes.

This is the first step in migrating applications as mentioned here: https://backstage.io/docs/plugins/composability#porting-existing-apps.

To apply this change to an existing app, switch out the `Routes` component from `react-router` to `FlatRoutes` from `@backstage/core`.
This also allows you to remove any `/*` suffixes on the route paths. For example:

```diff
import {
   OAuthRequestDialog,
   SidebarPage,
   createRouteRef,
+  FlatRoutes,
 } from '@backstage/core';
 import { AppSidebar } from './sidebar';
-import { Route, Routes, Navigate } from 'react-router';
+import { Route, Navigate } from 'react-router';
 import { Router as CatalogRouter } from '@backstage/plugin-catalog';
...
         <AppSidebar />
-        <Routes>
+        <FlatRoutes>
...
           <Route
-            path="/catalog/*"
+            path="/catalog"
             element={<CatalogRouter EntityPage={EntityPage} />}
           />
-          <Route path="/docs/*" element={<DocsRouter />} />
+          <Route path="/docs" element={<DocsRouter />} />
...
           <Route path="/settings" element={<SettingsRouter />} />
-        </Routes>
+        </FlatRoutes>
       </SidebarPage>
```

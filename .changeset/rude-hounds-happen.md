---
'@backstage/create-app': patch
---

Added an external route binding from the `org` plugin to the catalog index page.

This change is needed because `@backstage/plugin-org` now has a required external route that needs to be bound for the app to start.

To apply this change to an existing app, make the following change to `packages/app/src/App.tsx`:

```diff
 import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
+import { orgPlugin } from '@backstage/plugin-org';
 import { SearchPage } from '@backstage/plugin-search';
```

And further down within the `createApp` call:

```diff
     bind(scaffolderPlugin.externalRoutes, {
       registerComponent: catalogImportPlugin.routes.importPage,
     });
+    bind(orgPlugin.externalRoutes, {
+      catalogIndex: catalogPlugin.routes.catalogIndex,
+    });
   },
```

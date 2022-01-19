---
'@backstage/create-app': patch
---

Rebind external route for catalog import plugin from `scaffolderPlugin.routes.root` to `catalogImportPlugin.routes.importPage`.

To make this change to an existing app, make the following change to `packages/app/src/App.tsx`

```diff
const App = createApp({
  ...
  bindRoutes({ bind }) {
    ...
    bind(apiDocsPlugin.externalRoutes, {
-     createComponent: scaffolderPlugin.routes.root,
+     registerApi: catalogImportPlugin.routes.importPage,
    });
    ...
  },
});
```

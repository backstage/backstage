---
'@backstage/create-app': patch
---

The api-docs plugin has been migrated to use an [external route reference](https://backstage.io/docs/plugins/composability#binding-external-routes-in-the-app) to dynamically link to the create component page.

If you want to have a button that links to the scaffolder plugin from the API explorer, apply the following changes to `packages/app/src/App.tsx`:

```diff
+ import { apiDocsPlugin } from '@backstage/plugin-api-docs';
  import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

  const app = createApp({
    // ...
    bindRoutes({ bind }) {
+     bind(apiDocsPlugin.externalRoutes, {
+       createComponent: scaffolderPlugin.routes.root,
+     });
    },
  });
```

If you choose to not bind the routes, the button to create new APIs is not displayed.

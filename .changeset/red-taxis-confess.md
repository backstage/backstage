---
'@backstage/plugin-api-docs': patch
---

The api-docs plugin has been migrated to use an [external route reference](https://backstage.io/docs/plugins/composability#binding-external-routes-in-the-app) to dynamically link to the create component page. This means you need to migrate the api docs plugin to use the new extension components, as well as bind the external route.

To bind the external route from the api docs plugin to the scaffolder template index page, make sure you have the appropriate imports and add the following to the `createApp` call:

```ts
import { apiDocsPlugin } from '@backstage/plugin-api-docs';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

const app = createApp({
  // ...
  bindRoutes({ bind }) {
    bind(apiDocsPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
    });
  },
});
```

If you choose to not bind the routes, the button to create new APIs is not displayed.

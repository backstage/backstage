---
'@backstage/create-app': patch
'@backstage/plugin-scaffolder': minor
---

Expose the catalog-import route as an external route from the scaffolder.

This will make it possible to hide the "Register Existing Component" button
when you for example are running backstage with `catalog.readonly=true`.

As a consequence of this change you need add a new binding to your createApp call to
keep the button visible. However, if you instead want to hide the button you can safely
ignore the following example.

To bind the external route from the catalog-import plugin to the scaffolder template
index page, make sure you have the appropriate imports and add the following
to the createApp call:

```typescript
import { catalogImportPlugin } from '@backstage/plugin-catalog-import';

const app = createApp({
  // ...
  bindRoutes({ bind }) {
    // ...
    bind(scaffolderPlugin.externalRoutes, {
      registerComponent: catalogImportPlugin.routes.importPage,
    });
  },
});
```

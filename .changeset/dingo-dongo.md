---
'@backstage/plugin-catalog': minor
'@backstage/plugin-scaffolder': minor
---

The Scaffolder and Catalog plugins have been migrated to partially require use of the [new composability API](https://backstage.io/docs/plugins/composability). The Scaffolder used to register its pages using the deprecated route registration plugin API, but those registrations have been removed. This means you now need to add the Scaffolder plugin page to the app directly.

The page is imported from the Scaffolder plugin and added to the `<FlatRoutes>` component:

```tsx
<Route path="/create" element={<ScaffolderPage />} />
```

The Catalog plugin has also been migrated to use an [external route reference](https://backstage.io/docs/plugins/composability#binding-external-routes-in-the-app) to dynamically link to the create component page. This means you need to migrate the catalog plugin to use the new extension components, as well as bind the external route.

To use the new extension components, replace existing usage of the `CatalogRouter` with the following:

```tsx
<Route path="/catalog" element={<CatalogIndexPage />} />
<Route path="/catalog/:namespace/:kind/:name" element={<CatalogEntityPage />}>
  <EntityPage />
</Route>
```

And to bind the external route from the catalog plugin to the scaffolder template index page, make sure you have the appropriate imports and add the following to the `createApp` call:

```ts
import { catalogPlugin } from '@backstage/plugin-catalog';
import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

const app = createApp({
  // ...
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: scaffolderPlugin.routes.root,
    });
  },
});
```

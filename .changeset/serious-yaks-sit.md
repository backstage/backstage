---
'@backstage/core-app-api': patch
---

Added support for configuration of route bindings through static configuration, and default targets for external route refs.

In addition to configuring route bindings through code, it is now also possible to configure route bindings under the `app.routes.bindings` key, for example:

```yaml
app:
  routes:
    bindings:
      catalog.createComponent: catalog-import.importPage
```

Each key in the route binding object is of the form `<plugin-id>.<externalRouteName>`, where the route name is key used in the `externalRoutes` object passed to `createPlugin`. The value is of the same form, but with the name taken from the plugin `routes` option instead.

The equivalent of the above configuration in code is the following:

```ts
const app = createApp({
  // ...
  bindRoutes({ bind }) {
    bind(catalogPlugin.externalRoutes, {
      createComponent: catalogImportPlugin.routes.importPage,
    });
  },
});
```

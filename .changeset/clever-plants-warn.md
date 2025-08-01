---
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-app-api': patch
---

Add support for a new `aliasFor` option for `createRouteRef`. This allows for the creation of a new route ref that acts as an alias for an existing route ref that is installed in the app. This is particularly useful when creating modules that override existing plugin pages, without referring to the existing plugin. For example:

```tsx
export default createFrontendModule({
  pluginId: 'catalog',
  extensions: [
    PageBlueprint.make({
      params: {
        defaultPath: '/catalog',
        routeRef: createRouteRef({ aliasFor: 'catalog.catalogIndex' }),
        loader: () =>
          import('./CustomCatalogIndexPage').then(m => (
            <m.CustomCatalogIndexPage />
          )),
      },
    }),
  ],
});
```

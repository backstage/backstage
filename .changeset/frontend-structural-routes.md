---
'@backstage/frontend-plugin-api': minor
---

**BREAKING** `createRouteRef` now requires an `extensionId` identifying the routable extension. Remove `aliasFor` from source code and use `extensionId` instead. The `routeRef` options of `PageBlueprint` and `SubPageBlueprint` are deprecated. See the [migration guide](https://backstage.io/docs/tutorials/extension-route-reference-migration).

```ts
const rootRouteRef = createRouteRef({ extensionId: 'page:example' });
```

Frontend modules can now add or override named `routes` and `externalRoutes` in their plugin namespace. Module route overrides also redirect existing references to the original target, allowing deprecated route names to remain aliases. The runtime remains compatible with previously compiled route refs and features.

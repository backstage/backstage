---
'@backstage/frontend-plugin-api': minor
---

**BREAKING** `createRouteRef` now requires an `extensionId` identifying the target extension, such as a page or entity content extension. Remove `aliasFor` from source code and use `extensionId` instead. The `routeRef` options of `PageBlueprint` and `SubPageBlueprint` are deprecated, but published plugins should retain them to support older frontend system versions until the options are removed. See the [migration guide](https://backstage.io/docs/frontend-system/architecture/migrations#route-references-target-extension-ids).

```ts
const rootRouteRef = createRouteRef({ extensionId: 'page:example' });
```

Frontend modules can now add or override named `routes` and `externalRoutes` in their plugin namespace. Named route overrides must replace absolute references with absolute references; modules can add subroutes but cannot override them. Module route overrides also redirect existing references to the original target, allowing deprecated route names to remain aliases. The runtime remains compatible with previously compiled route refs and features.

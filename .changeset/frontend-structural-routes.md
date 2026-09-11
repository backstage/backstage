---
'@backstage/frontend-plugin-api': minor
---

**BREAKING** `createRouteRef` now requires an `extensionId` identifying the routable extension. Remove `aliasFor` from source code and use `extensionId` instead. The `routeRef` options of `PageBlueprint` and `SubPageBlueprint` are deprecated.

```ts
const rootRouteRef = createRouteRef({ extensionId: 'page:example' });
```

Frontend modules can now add or override named `routes` in their plugin namespace. These overrides affect external defaults and configuration bindings without changing existing structural references. The runtime remains compatible with previously compiled route refs and features.

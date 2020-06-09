# createPlugin - router

The router that is passed to the `register` function makes it possible for
plugins to hook into routing of the Backstage app and provide the end users with
new views to navigate to. This is done by utilising the following methods on the
`router`:

```typescript
addRoute(
  target: RouteRef,
  Component: ComponentType<any>,
  options?: RouteOptions,
): void;

/**
 * @deprecated See the `addRoute` method
 */
registerRoute(
  path: RoutePath,
  Component: ComponentType<any>,
  options?: RouteOptions,
): void;
```

## RouteRef

`addRoute` method is using mutable RouteRefs, which can be created as following:

```ts
import { createRouteRef } from '@backstage/core';

const myPluginRouteRef = createRouteRef({
  path: '/my-plugin',
  title: 'My Plugin',
});
```

[Back to References](README.md)

# createPlugin - router

The router that is passed to the `register` function includes makes it possible for plugins to hook into routing of the Backstage app and provide the end users with new views to navigate to.

```typescript
type RouterHooks = {
  registerRoute(
    path: RoutePath,
    Component: ComponentType<any>,
    options?: RouteOptions,
  ): void;

  registerRedirect(
    path: RoutePath,
    target: RoutePath,
    options?: RouteOptions,
  ): void;
};
```

[Back to References](README.md)

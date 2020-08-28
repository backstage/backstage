---
id: plugin-development
title: Plugin Development
---

Backstage plugins provide features to a Backstage App.

Each plugin is treated as a self-contained web app and can include almost any
type of content. Plugins all use a common set of platform APIs and reusable UI
components. Plugins can fetch data from external sources using the regular
browser APIs or by depending on external modules to do the work.

## Developing guidelines

- Consider writing plugins in `TypeScript`.
- Plan the directory structure of your plugin so that it becomes easy to manage.
- Prefer using the [Backstage components](https://backstage.io/storybook),
  otherwise go with [Material-UI](https://material-ui.com/).
- Check out the shared Backstage APIs before building a new one.

## Plugin concepts / API

### Routing

Each plugin is responsible for registering its components to corresponding
routes in the app.

The app will call the `createPlugin` method on each plugin, passing in a
`router` object with a set of methods on it.

```jsx
import { createPlugin, createRouteRef } from '@backstage/core';
import ExampleComponent from './components/ExampleComponent';

export const rootRouteRef = createRouteRef({
  path: '/new-plugin',
  title: 'New plugin',
});

export const plugin = createPlugin({
  id: 'new-plugin',
  register({ router }) {
    router.addRoute(rootRouteRef, ExampleComponent);
  },
});
```

#### `router` API

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

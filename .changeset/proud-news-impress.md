---
'@backstage/core': minor
---

Removed deprecated `router.registerRoute` method in `createPlugin`.

Deprecated `router.addRoute` method in `createPlugin`.

Replace usage of the above two components with a routable extension.

For example, given the following:

```ts
import { createPlugin } from '@backstage/core';
import { MyPage } from './components/MyPage';
import { rootRoute } from './routes';

export const plugin = createPlugin({
  id: 'my-plugin',
  register({ router }) {
    router.addRoute(rootRoute, MyPage);
  },
});
```

Migrate to

```ts
import { createPlugin, createRoutableExtension } from '@backstage/core';
import { rootRoute } from './routes';

export const plugin = createPlugin({
  id: 'my-plugin',
  routes: {
    root: rootRoute,
  },
});

export const MyPage = plugin.provide(
  createRoutableExtension({
    component: () => import('./components/MyPage').then(m => m.MyPage),
    mountPoint: rootRoute,
  }),
);
```

And then use `MyPage` like this in the app:

```tsx
<FlatRoutes>
...
  <Route path='/my-path' element={<MyPage />}>
...
</FlatRoutes>
```

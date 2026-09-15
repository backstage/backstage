---
'@backstage/frontend-plugin-api': patch
'@backstage/plugin-app': minor
---

Existing new frontend system pages retain implicit React Router v6 routing.
Route parameters, relative links and nested routes continue to work without
an immediate migration. In development, consuming this fallback logs a warning
once per extension per app instance. Render an explicit page adapter to migrate
that content; pages using only framework routing do not need an adapter. The old frontend system is unchanged.

A page that wants its routing library's own APIs declares one by rendering it inside its own `loader`, which is ordinary React rather than extension wiring:

```tsx
import { ReactRouterV6PageRouter } from '@backstage/plugin-app-react-router-v6';

PageBlueprint.make({
  params: {
    path: '/catalog',
    loader: () =>
      import('./CatalogPage').then(m => (
        <ReactRouterV6PageRouter>
          <m.CatalogPage />
        </ReactRouterV6PageRouter>
      )),
  },
});
```

When migrating, pages whose content routes with React Router can add `@backstage/plugin-app-react-router-v6` and declare it this way.

Explicit adapters nest: routing libraries publish different React context objects, so a sub-page written with one library works under a page written with another, in either direction. Declaring an adapter in a sub-page's `loader` scopes it to that sub-page, since the sub-page's own mount is what is in context there. Router-owned state therefore belongs to the sub-page that declared it and is rebuilt when the active tab changes, while the page shell around it stays mounted.

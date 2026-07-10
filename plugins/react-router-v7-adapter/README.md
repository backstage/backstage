# @backstage/plugin-react-router-v7-adapter

React Router v7 adapter for Backstage's router-agnostic plugin routing (RFC [#33603](https://github.com/backstage/backstage/issues/33603)).

Injects React Router `UNSAFE_*` contexts from a `RoutingContract` so plugins can
import from `react-router` / `react-router-dom` v7. Navigation is delegated to the
contract; this package never writes `window.history` via `pushState` / `replaceState`
or `go`.

This package is deliberately separate from
`@backstage/plugin-react-router-v6-adapter` and does not share React Router
dependencies with it.

## Usage

Attach `ReactRouterV7PageRouter` to a page's optional `router` input via
`PageRouterBlueprint` to override the app-plugin default (React Router v6):

```tsx
import { PageRouterBlueprint } from '@backstage/frontend-plugin-api';
import { ReactRouterV7PageRouter } from '@backstage/plugin-react-router-v7-adapter';

const myV7Router = PageRouterBlueprint.make({
  attachTo: { id: 'page:my-plugin', input: 'router' },
  params: {
    component: ReactRouterV7PageRouter,
  },
});
```

Or build a scoped router directly:

```tsx
import { createScopedRouter } from '@backstage/plugin-react-router-v7-adapter';

const { Router } = createScopedRouter(contract, {
  routePattern: '/settings',
  appBasename: '/backstage',
  go: delta => navigationController.go(delta),
});
```

## Multi-router coexistence

This package is the React Router v7 adapter used in the multi-router coexistence
demo for RFC [#33603](https://github.com/backstage/backstage/issues/33603).
The coexistence proof is an integration test
(`src/multiRouterCoexistence.test.tsx`) that mounts:

- a page on the **app-plugin default** React Router v6 adapter
- a page with a **v7** `PageRouterBlueprint` override
- a **subpage** with a v7 override under a default-v6 parent

It exercises cross-plugin `RouteLink` / framework navigate between those pages
and browser back/forward via the memory-history navigation controller.

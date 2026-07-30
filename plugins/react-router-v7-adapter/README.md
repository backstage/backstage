# @backstage/plugin-react-router-v7-adapter

React Router v7 adapter for Backstage's router-agnostic plugin routing (RFC [#33603](https://github.com/backstage/backstage/issues/33603)).

Injects React Router `UNSAFE_*` contexts projected from the framework's
`AppHistoryApi` so plugins can import from `react-router` / `react-router-dom`
v7. Navigation is delegated to `AppHistoryApi.navigate`; this package never
writes `window.history` via `pushState` / `replaceState` or `go`. Programmatic
back/forward (`navigate(-1)`) is not supported — there is a single, real
browser history; use the browser's own back/forward.

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

`ReactRouterV7PageRouter` renders `children` as opaque content inside the
scoped React Router v7 context — an existing `<Routes>` tree composed by the
page itself (e.g. from a `PageBlueprint` `loader`) keeps working, including
relative `Link`s, nested `<Routes>`, and `useParams`.

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

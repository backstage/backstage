# @backstage/plugin-react-router-v6-adapter

> **Deprecated**: This package's implementation moved into
> `@backstage/plugin-app` (`plugins/app/src/routing/reactRouterV6`) as part of
> the scoped plugin routing rewrite (RFC
> [#33603](https://github.com/backstage/backstage/issues/33603)). This
> package now only re-exports `ReactRouterV6PageRouter` for existing
> consumers and will be removed in a future release.

React Router v6 adapter for Backstage's router-agnostic plugin routing (RFC [#33603](https://github.com/backstage/backstage/issues/33603)).

Injects React Router `UNSAFE_*` contexts from a `RoutingContract` so existing
plugins can keep importing from `react-router-dom`. Navigation is delegated to the
contract; this package never writes `window.history` via `pushState` / `replaceState`.

## Usage

The app plugin registers `ReactRouterV6PageRouter` as the default page router via
`pageRouterApiRef`. Pages without a `router` input override receive this adapter
automatically.

To override the default for a specific page, attach `ReactRouterV6PageRouter` via
`PageRouterBlueprint`:

```tsx
import { PageRouterBlueprint } from '@backstage/frontend-plugin-api';
import { ReactRouterV6PageRouter } from '@backstage/plugin-react-router-v6-adapter';

const myV6Router = PageRouterBlueprint.make({
  attachTo: { id: 'page:my-plugin', input: 'router' },
  params: {
    component: ReactRouterV6PageRouter,
  },
});
```

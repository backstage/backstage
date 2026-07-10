# @backstage/plugin-react-router-v6-adapter

React Router v6 adapter for Backstage's router-agnostic plugin routing (RFC [#33603](https://github.com/backstage/backstage/issues/33603)).

Injects React Router `UNSAFE_*` contexts from a `RoutingContract` so existing
plugins can keep importing from `react-router-dom`. Navigation is delegated to the
contract; this package never writes `window.history` via `pushState` / `replaceState`.

## Usage

The app plugin registers `ReactRouterV6PageRouter` as the default page router via
`pageRouterApiRef`. Pages without a `router` input override receive this adapter
automatically.

```tsx
import { createScopedRouter } from '@backstage/plugin-react-router-v6-adapter';

const { Router } = createScopedRouter(contract, {
  routePattern: '/catalog/:namespace/:kind/:name',
  appBasename: '/backstage',
  go: delta => navigationController.go(delta),
});
```

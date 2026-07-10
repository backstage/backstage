# @backstage/plugin-tanstack-router-adapter

TanStack Router adapter for Backstage's router-agnostic plugin routing (RFC [#33603](https://github.com/backstage/backstage/issues/33603)).

Compiles library-agnostic `RouteDescriptor` trees into a TanStack `routeTree` and
projects `RoutingContract` into a hand-rolled `RouterHistory`. Navigation is
delegated to the contract; this package never writes `window.history` via
`pushState` / `replaceState`, and never keeps a second authoritative history
stack.

TanStack `__TSR_*` metadata is stored in the contract's namespaced
`adapterState` (`tanstack-router`), not in user-visible navigation state.
`canGoBack` / `historyLength` / `go` come from the contract.

## Usage

### Page override (PageRouterBlueprint)

```tsx
import { PageRouterBlueprint } from '@backstage/frontend-plugin-api';
import { TanStackPageRouter } from '@backstage/plugin-tanstack-router-adapter';

const tanstackRouter = PageRouterBlueprint.make({
  attachTo: { id: 'page:my-plugin', input: 'router' },
  params: {
    component: TanStackPageRouter,
  },
});
```

### Default page router (pageRouterApiRef)

```tsx
import { ApiBlueprint, pageRouterApiRef } from '@backstage/frontend-plugin-api';
import { TanStackPageRouter } from '@backstage/plugin-tanstack-router-adapter';

ApiBlueprint.make({
  name: 'page-router',
  params: defineParams =>
    defineParams({
      api: pageRouterApiRef,
      deps: {},
      factory: () => ({
        getDefaultRouter: () => TanStackPageRouter,
        getCapabilities: () => ({ supportsOpaqueChildren: false }),
      }),
    }),
});
```

Pages **must** declare in-page routes as `RouteDescriptor`s (via
`PageBlueprint` `routes` or the `pages` input / `SubPageBlueprint`). Opaque
React Router `<Routes>` children inside a `loader` are **not** supported —
`PageBlueprint` fails fast when this adapter is the default and a page uses
the opaque loader path. There is no TanStack opaque-children bridge; keep the
React Router page adapter (or migrate to descriptors).

## Limits

- Blockers follow TanStack history semantics: push/replace through the adapter
  register into the shared `HistoryBackend` blocker seam so chrome and adapter
  navigations share policy; go/back/forward never run blockers.
- Opaque React Router children under a TanStack default are unsupported by
  policy � pages must use route descriptors (or keep a React Router adapter).
  There is no TanStack opaque-children bridge package.
- The public surface matches sibling page adapters: `TanStackPageRouter` and
  `createTanStackScopedRouter`.

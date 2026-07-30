# @backstage/plugin-tanstack-router-adapter

TanStack Router adapter for Backstage's router-agnostic plugin routing (RFC [#33603](https://github.com/backstage/backstage/issues/33603)).

Renders page content under a single TanStack root route and projects the
framework's `AppHistoryApi` into a hand-rolled `RouterHistory`, scoped to the
page's `basePath`. Navigation is delegated to `AppHistoryApi.navigate`; this
package never writes `window.history` via `pushState` / `replaceState`.

`AppHistoryApi` is a single, global history authority with no per-adapter
metadata channel, so TanStack `__TSR_*` bookkeeping (history depth / entry
keys) is tracked locally by this adapter only — it does not survive a full
remount and is not shared with other adapters or app chrome.
Back/forward/`go` are not supported programmatically (there is a single,
real browser history) — calling them warns and no-ops; use the browser's own
back/forward.

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

Only single-page (opaque `loader`) content is supported today — this adapter
renders `children` under one TanStack root route. Pages composed from
multiple sub-pages (`PageBlueprint` `pages` input / `SubPageBlueprint` tabs)
render as a native React Router `<Routes>` tree, which this adapter cannot
host either — `PageBlueprint` fails fast when this adapter is the default and
a page relies on any such opaque React Router content, via
`supportsOpaqueChildren: false`. Pages that need nested in-page routing must
declare a native TanStack route tree themselves (not yet supported by this
adapter) or keep a React Router page adapter.

## Limits

- `history.block` (`useBlocker`) is a **local** seam: it only intercepts
  push/replace initiated through this page's own TanStack `<Link>` /
  `router.navigate`. It is not shared with framework/chrome navigation —
  `AppHistoryApi` has no shared blocker registry.
- `go` / `back` / `forward` warn and no-op instead of touching
  `window.history` — there is a single, real browser history; use the
  browser's own back/forward.
- There is no TanStack opaque-children bridge, and no in-page route tree
  compilation — pages that need nested in-page routing must keep a React
  Router page adapter until native TanStack route trees are supported here.
- The public surface matches sibling page adapters: `TanStackPageRouter` via
  `PageRouterBlueprint` / `pageRouterApiRef`.

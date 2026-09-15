# @backstage/plugin-app-tanstack-router

Renders a page of the [new frontend system](https://backstage.io/docs/frontend-system/)
with [TanStack Router](https://tanstack.com/router), scoped to the page's own
path.

Browser history belongs to the app. This package never writes to
`window.history`. It only scopes TanStack Router to the page it renders, so
programmatic back, forward, and `go` traverse the app-owned history.

This package is part of scoped plugin routing,
[RFC #33603](https://github.com/backstage/backstage/issues/33603).

## Installation

TanStack Router is a peer dependency, so install it alongside the adapter:

```sh
cd <package-dir> # if within a monorepo
yarn add @backstage/plugin-app-tanstack-router @tanstack/react-router @tanstack/history
```

With React 18 types, `@tanstack/react-router@1.170.36` has a published
`CatchBoundary` declaration that fails dependency type checking with `TS2416`.
Patch its `render` declaration to `render(): React.ReactNode;` in both
`dist/esm/CatchBoundary.d.ts` and `dist/cjs/CatchBoundary.d.cts` using your
package manager's patch support. Backstage applies this declaration-only patch
in its repository; installing this adapter does not apply that patch to your
app. The patch leaves the router runtime unchanged.

## Usage

Render `TanStackPageRouter` inside the `loader` of the page whose
content should get the context:

```tsx
import { PageBlueprint } from '@backstage/frontend-plugin-api';
import { TanStackPageRouter } from '@backstage/plugin-app-tanstack-router';

const toolsPage = PageBlueprint.make({
  params: {
    path: '/tools',
    loader: () =>
      import('./components/ToolsPage').then(m => (
        <TanStackPageRouter>
          <m.ToolsPage />
        </TanStackPageRouter>
      )),
  },
});
```

`TanStackPageRouter` renders the content it is given through a catch-all route.
That covers pages that render the content they are handed without routing inside
it.

The adapter is scoped where a `loader` renders it. TanStack Router publishes
its own React context, so it can nest with adapters from other libraries.
The app also retains a root React Router v6 projection for shared components;
page content that uses v6 needs its own adapter for page-relative routing.

Rendering it in a sub-page's `loader` scopes it to that sub-page, because the
sub-page's own mount is what is in context there. Sibling tabs may declare
different libraries, or none at all.

Declare it on the page or sub-page, never on page content. An
`EntityContentBlueprint` tab, a card, or anything else filling a region of
another page already renders inside the adapter that page declared, one
route match deeper. A second adapter there re-scopes to the page's own mount and
drops the tab's match, so relative targets in that content resolve from the page
instead of from the tab.

### Where there is nothing to scope to

Scoping needs two things: a page mount, saying which part of the URL belongs to
the page, and a registered `AppHistoryApi` to project a history from. With
either missing, this adapter renders its children untouched and asks nothing of
the surrounding app — no API provider, no framework context. No route tree is
built, and `createRouter` is never called.

That passthrough is what lets a plugin shipping for both frontend systems wrap a
shared component in the adapter. The old frontend system supplies neither half,
so the wrap is invisible there rather than a crash. The same holds in a plugin's
own `render()` unit tests, which stand up no app at all. A router built with
`createTanStackPageRouter` behaves the same way.

### Using a plugin-owned route tree

To route with a nested TanStack tree of your own, build the page router from
that tree with `createTanStackPageRouter`. Render `TanStackPageContent`
wherever in the tree the Backstage page element belongs:

```tsx
import { PageBlueprint } from '@backstage/frontend-plugin-api';
import {
  TanStackPageContent,
  createTanStackPageRouter,
} from '@backstage/plugin-app-tanstack-router';
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import { ToolDetails } from './ToolDetails';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <TanStackPageContent />
      <Outlet />
    </>
  ),
});
const detailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/details',
  component: ToolDetails,
});
const routeTree = rootRoute.addChildren([detailsRoute]);

const ToolsPageRouter = createTanStackPageRouter({
  createRouter: ({ history }) => createRouter({ routeTree, history }),
});

const toolsPage = PageBlueprint.make({
  params: {
    path: '/tools',
    loader: () =>
      import('./components/ToolsPage').then(m => (
        <ToolsPageRouter>
          <m.ToolsPage />
        </ToolsPageRouter>
      )),
  },
});
```

Going through the factory keeps TanStack types out of the framework's public
contract, so they stay inside this package and your own plugin.

## Limitations

`useBlocker` only intercepts navigation that starts inside this page. It cannot
see navigation coming from elsewhere in the app, because the app's history API
has no shared blocker contract.

Custom `AppHistoryApi` implementations are supported. The public interface
reports locations and accepts navigation requests; it does not report entry
identity, stack position, traversal completion, or operation correlation.
Without the optional internal entry metadata used by the built-in history, the
adapter exposes one synthetic slot: `history.length` is `1`, `__TSR_index` is
`0`, and both `history.canGoBack()` and TanStack's `useCanGoBack()` return `false`.
Back, forward, and `go` still delegate to the host even with this conservative
back-availability result.

An adapter-initiated navigation retains its action when the host notifies
synchronously. Delayed or unrelated host updates are reported as `GO` with a
zero delta, since the adapter cannot correlate them with an earlier request.
Synthetic keys identify observed locations and cannot restore a previous
entry's identity on traversal. Entry-based scroll restoration therefore lacks
full fidelity with these custom histories. The adapter does not infer a second
history stack from URLs, which can be identical for different entries.

## Documentation

- [Scoped plugin routing](https://backstage.io/docs/frontend-system/architecture/routes#scoped-plugin-routing)
- [Backstage Documentation](https://backstage.io/docs)

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
yarn add @backstage/plugin-app-tanstack-router @tanstack/react-router@1.131.2 @tanstack/history@1.131.2
```

The adapter pins `@tanstack/react-router` to `1.131.2`, the latest release
verified to pass strict dependency type checking with React 18 without a
package patch. Newer releases through `1.170.36` have declaration errors
in TanStack Router or its router-core dependency.

This issue may already be fixed in a newer TanStack Router release when you read
this. Check the [latest releases](https://github.com/TanStack/router/releases)
and the adapter's current peer dependency range before choosing a version.

## Usage

Render `TanStackPageRouter` inside the lazily loaded component of the page whose
content should get the context:

```tsx
import { PageBlueprint } from '@backstage/frontend-plugin-api';

const toolsPage = PageBlueprint.make({
  params: {
    path: '/tools',
    loader: () => import('./components/ToolsPage').then(m => <m.ToolsPage />),
  },
});
```

The adapter belongs in the lazily loaded component module. Wrap the page's existing JSX directly; only hooks that consume this router need to be in a child beneath it.

```tsx title="./components/ToolsPage.tsx"
import { TanStackPageRouter } from '@backstage/plugin-app-tanstack-router';

export function ToolsPage() {
  return (
    <TanStackPageRouter>
      {/* Existing page JSX and local routes go here. */}
    </TanStackPageRouter>
  );
}
```

`TanStackPageRouter` renders the content it is given through a catch-all route.
That covers pages that render the content they are handed without routing inside
it.

The adapter is scoped where the page component renders it. TanStack Router publishes
its own React context, so it can nest with adapters from other libraries.
The app also retains a root React Router v6 projection for shared components;
page content that uses v6 needs its own adapter for page-relative routing.

Rendering it in a sub-page's component scopes it to that sub-page, because the
sub-page's own mount is what is in context there. Sibling tabs may declare
different libraries, or none at all.

Declare it in the component that owns the page or sub-page route mount. An
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

```tsx title="plugins/tools/src/components/ToolsPage.tsx"
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

export function ToolsPage() {
  return (
    <ToolsPageRouter>
      <h1>Tools</h1>
    </ToolsPageRouter>
  );
}
```

Going through the factory keeps TanStack types out of the framework's public
contract, so they stay inside this package and your own plugin.

## Limitations

`useBlocker` only intercepts navigation that starts inside this page. It cannot
see navigation coming from elsewhere in the app, because the app's history API
has no shared blocker contract.

Custom `AppHistoryApi` implementations must expose their updated location
snapshot synchronously when handling push or replace navigation. TanStack
notifies its subscribers immediately after the host handles the request;
later host notifications for that write are ignored. Back, forward, and `go`
notify subscribers when the host emits the resulting location, which can be
asynchronous.

The public interface reports locations and accepts navigation requests; it does
not report entry identity, stack position, traversal completion, or operation
correlation.
Without the optional internal entry metadata used by the built-in history, the
adapter exposes one synthetic slot: `history.length` is `1`, `__TSR_index` is
`0`, and both `history.canGoBack()` and TanStack's `useCanGoBack()` return `false`.
Back, forward, and `go` still delegate to the host even with this conservative
back-availability result.

TanStack supplies its native push and replace actions, blockers, and state
fields. Host updates without entry metadata are reported as `GO` with a zero
delta. Keys supplied by TanStack can remain in the host's state, but hosts
without entry metadata cannot reliably identify entries created elsewhere in
the app. Entry-based scroll restoration therefore lacks full fidelity with
these custom histories. The adapter does not infer a second history stack from
URLs, which can be identical for different entries.

## Documentation

- [Scoped plugin routing](https://backstage.io/docs/frontend-system/architecture/routes#scoped-plugin-routing)
- [Backstage Documentation](https://backstage.io/docs)

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

## Usage

Attach `TanStackPageRouter` to a page's `router` input with
`PageRouterBlueprint`:

```tsx
import { PageRouterBlueprint } from '@backstage/frontend-plugin-api';
import { TanStackPageRouter } from '@backstage/plugin-app-tanstack-router';

const toolsPageRouter = PageRouterBlueprint.make({
  attachTo: { id: 'page:tools', input: 'router' },
  params: {
    component: TanStackPageRouter,
  },
});
```

`TanStackPageRouter` renders the page content through a catch-all route. That
covers pages that render the content they are handed without routing inside it.

Sub-pages with no router override inherit the page's TanStack adapter at page
scope, so the same adapter remains mounted while users move between sibling
tabs. To give one sub-page its own TanStack context, attach the adapter to that
sub-page, for example
`attachTo: { id: 'sub-page:tools/overview', input: 'router' }`. This can replace
another router library or create a sub-page-scoped TanStack instance. The
explicit sub-page adapter replaces the page adapter around the active content;
the two routers are not nested.

The framework reads the `PageRouterBlueprint` attachment before it renders the
content. It can therefore replace the default React Router v6 adapter instead
of mounting TanStack Router inside it.

### Using a plugin-owned route tree

To route with a nested TanStack tree of your own, build the page router from
that tree with `createTanStackPageRouter`. Render `TanStackPageContent`
wherever in the tree the Backstage page element belongs:

```tsx
import { PageRouterBlueprint } from '@backstage/frontend-plugin-api';
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

const toolsPageRouter = PageRouterBlueprint.make({
  attachTo: { id: 'page:tools', input: 'router' },
  params: { component: ToolsPageRouter },
});
```

Going through the factory keeps TanStack types out of the core
`PageRouterComponent` contract, so they stay inside this package and your own
plugin.

## Limitations

`useBlocker` only intercepts navigation that starts inside this page. It cannot
see navigation coming from elsewhere in the app, because the app's history API
has no shared blocker contract.

## Documentation

- [Scoped plugin routing](https://backstage.io/docs/frontend-system/architecture/routes#scoped-plugin-routing)
- [Backstage Documentation](https://backstage.io/docs)

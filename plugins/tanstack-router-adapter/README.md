# @backstage/plugin-tanstack-router-adapter

Renders new frontend system pages with [TanStack Router](https://tanstack.com/router), scoped to the page's own path. Part of scoped plugin routing, RFC [#33603](https://github.com/backstage/backstage/issues/33603).

Browser history stays owned by the app: this package never writes to `window.history` itself, it only scopes TanStack Router to the page it renders.

## Usage

Attach `TanStackPageRouter` to a page's `router` input with `PageRouterBlueprint`:

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

To use a plugin-owned nested route tree, create the page adapter from that tree:

```tsx
import { PageRouterBlueprint } from '@backstage/frontend-plugin-api';
import {
  TanStackPageContent,
  createTanStackPageRouter,
} from '@backstage/plugin-tanstack-router-adapter';
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';

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
  component: Details,
});
const routeTree = rootRoute.addChildren([detailsRoute]);

const ToolsPageRouter = createTanStackPageRouter({
  createRouter: ({ history }) => createRouter({ routeTree, history }),
});

const tanstackRouter = PageRouterBlueprint.make({
  attachTo: { id: 'page:tools', input: 'router' },
  params: { component: ToolsPageRouter },
});
```

The factory keeps TanStack types out of the core `PageRouterComponent` contract. `TanStackPageContent` renders the opaque element supplied by the page blueprint; place it anywhere in your route tree.

## Limits

Pages built from sub-pages (tabs) are supported: the framework's own route matching picks the sub-page to show, and this adapter renders whatever it is given. Content is always opaque, whether it comes from a `PageBlueprint` `loader` or from a sub-page — if it routes internally with another library, that is the page author's choice, made alongside their choice of this adapter. Attach this adapter to a sub-page as well to give that sub-page's content a TanStack context scoped to the sub-page itself.

- Programmatic back, forward, and `go` traverse the app-owned browser history.
- `useBlocker` only intercepts navigation started from within this page. It does not see navigation coming from elsewhere in the app.

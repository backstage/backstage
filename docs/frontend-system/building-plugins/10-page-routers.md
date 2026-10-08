---
id: page-routers
title: Choose a Router for a Page
sidebar_label: Page Routers
description: Render a page with React Router v6, React Router v7 or TanStack Router
---

Most pages need no router at all. `useRouteRef`, `useRouteRefParams` and
`useAppHref` from `@backstage/frontend-plugin-api` answer from the framework's own
routing. They work on every page, whichever library it uses and on pages that
use none. Try them before reaching for anything else on this page.

Framework path targets must start with `/`, excluding the deployment basename.
Use route refs to generate paths without hardcoding where a plugin is mounted.
Empty, query-only, and hash-only targets keep the current pathname; external URLs remain
supported. Relative paths such as `details`, `.` and `../edit` require a page
router. BUI controls inside an adapter use that library's relative semantics at
the control's route scope. App-absolute paths and route-ref destinations work
across plugins through both BUI and the library's own navigation APIs.

Existing new frontend system pages retain implicit React Router v6 routing.
Route parameters, relative links and nested routes continue to work without
an immediate migration. In development, consuming this fallback logs a warning
once per extension per app instance. Render an explicit page adapter to migrate
that content; pages using only framework routing do not need an adapter.

A page that does want its library's own APIs adds a _page router_: a component
that supplies routing context scoped to that page's own path. For the reasoning
behind page-scoped routing, see
[Scoped plugin routing](../architecture/36-routes.md#scoped-plugin-routing).

:::note
A page router changes only the library that renders that page's content. The app
still owns browser history, and navigation between plugins still goes through
`AppHistoryApi`.
:::

## Declare a router in the lazy page component

A page router is declared by rendering it, inside the lazily loaded page component. This keeps the adapter import and its
routing library out of the blueprint module. There is no extension to attach and no input to fill: this is
ordinary React, and the adapter resolves its routing scope from the app node
it is rendered inside.

```tsx title="plugins/tools/src/alpha.tsx"
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
import { ReactRouterV6PageRouter } from '@backstage/plugin-app-react-router-v6';

export function ToolsPage() {
  return (
    <ReactRouterV6PageRouter>
      {/* Existing page JSX and local routes go here. */}
    </ReactRouterV6PageRouter>
  );
}
```

Because a router is something the content adds rather than something the
framework picks, routers **nest**. Two libraries publish two different React
context objects, so an adapter inside another adapter's content adds a second
context instead of replacing the first. A page written with one library can
therefore host a component — or a whole sub-page — written with another, and
neither has to know about the other.

### Declare an adapter at a route mount

Components loaded by `PageBlueprint` and `SubPageBlueprint` can declare adapters.
Ordinary route-bearing extensions can do the same: publish
`coreExtensionData.routePath` and render content through `ExtensionBoundary`.
The framework uses the extension's matched ancestry to provide its mount.
The parent extension retains responsibility for composing and rendering its
children.

Content that does not introduce a route mount normally uses the adapter above
it. An entity tab or card already rendered inside a routing library's nested
route should not add an adapter for the enclosing page. Doing so can discard
the library's nested match and resolve relative links from the page instead of
from the tab.

### An adapter with nothing to scope to is inert

Scoping needs two things: a page mount, saying which part of the URL belongs to
the page, and a registered `AppHistoryApi` to project a location from. With
either missing, an adapter renders its children untouched and asks nothing of
the surrounding app — no API provider, no framework context. The TanStack
adapter also builds no route tree and never calls `createRouter`.

That passthrough is what lets a plugin shipping for **both** frontend systems
wrap a shared component in an adapter. The old frontend system has neither a
page mount nor an app history, so the wrap is invisible there rather than a
crash. The same holds in a plugin's own `render()` unit tests, which stand up no
app at all.

## Use React Router v6

Existing plugins that already use `react-router-dom` v6 need this adapter to
keep their relative links, nested `<Routes>` and `useParams` working:

```shell
yarn --cwd plugins/<plugin-name> add @backstage/plugin-app-react-router-v6
```

The package expects `react-router` and `react-router-dom` version 6 as peer
dependencies, which a plugin using those APIs already has. Render
`ReactRouterV6PageRouter` in the lazy page component, as shown above.

## Use React Router v7

```shell
yarn --cwd plugins/<plugin-name> add @backstage/plugin-app-react-router-v7
```

The package expects `react-router` and `react-router-dom` version 7 as peer
dependencies, so install those too if your plugin does not already have them.

```tsx title="plugins/tools/src/alpha.tsx"
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
import { ReactRouterV7PageRouter } from '@backstage/plugin-app-react-router-v7';

export function ToolsPage() {
  return (
    <ReactRouterV7PageRouter>
      {/* Existing page JSX and local routes go here. */}
    </ReactRouterV7PageRouter>
  );
}
```

The page's content renders inside a v7 context bound to the page's own mount
path, so relative `Link` targets, nested `<Routes>`, and `useParams` all resolve
against the page rather than against the app root.

## Use TanStack Router

```shell
yarn --cwd plugins/<plugin-name> add @backstage/plugin-app-tanstack-router
```

Install `@tanstack/react-router@1.131.2` and `@tanstack/history@1.131.2` alongside
the adapter. The router peer dependency is pinned to a release that supports
React 18 type checking without a package patch.

How you use it depends on whether your page has a route tree of its own.

### Render page content as-is

`TanStackPageRouter` renders whatever it is given through a catch-all route. Use
it when you want TanStack to own the page's routing context but the page content
itself does not declare TanStack routes:

```tsx title="plugins/tools/src/alpha.tsx"
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

### Bind a nested route tree

When your plugin owns a TanStack route tree, build an adapter with
`createTanStackPageRouter` instead. Render `TanStackPageContent` at the point in
the tree where the page's own content belongs:

```tsx title="plugins/tools/src/router.tsx"
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

export const ToolsPageRouter = createTanStackPageRouter({
  createRouter: ({ history, routePaths }) => {
    const rootRoute = createRootRoute({ component: Outlet });
    const routeTree = rootRoute.addChildren(
      routePaths.map(routePath => {
        const pageRoute = createRoute({
          getParentRoute: () => rootRoute,
          path: routePath,
          component: () => (
            <>
              <TanStackPageContent />
              <Outlet />
            </>
          ),
        });
        const detailsRoute = createRoute({
          getParentRoute: () => pageRoute,
          path: 'details',
          component: ToolDetails,
        });
        return pageRoute.addChildren([detailsRoute]);
      }),
    );
    return createRouter({ routeTree, history });
  },
});
```

The `history` uses app-absolute paths and shares the app's browser timeline.
The supplied `routePaths` contains the page's mount patterns in TanStack syntax,
including parameters. Optional static segments produce multiple patterns; mount
the plugin's routes at each one. For a `/` mount, attach the plugin's routes
directly to the root route. Keep TanStack's
`basepath` at `/`; the adapter applies the deployment basename when producing
browser hrefs. A target such as `/catalog` can then leave the plugin through
TanStack's own `Link` or `navigate`, including when generated from a route ref. Render `ToolsPageRouter` in the lazy page component the same way as above.
TanStack types stay inside the adapter package and your plugin, so nothing leaks
into the framework's public contract.

The adapter uses TanStack's native history implementation for subscriptions,
push and replace blockers, and navigation state. Backstage's app history owns
the shared browser timeline. If your app provides a custom `AppHistoryApi`, a
successful push or replace must update its `location` snapshot synchronously.
Numeric history traversal may finish asynchronously and notify through
`location$`. The built-in app history supports both requirements.

Custom histories do not need private entry metadata. Without it, back
availability and entry-based restoration are limited: the adapter cannot infer
a browser stack from the URLs it has visited.

TanStack push and replace blockers apply to navigation through that adapter.
They do not block navigation initiated by another adapter, browser traversal,
or page unload.

## Choose a router for a sub-page

A sub-page is an ordinary route one level below its page, and it is no more
special than the page is: it declares a router by rendering one in its own
lazily loaded component.

```tsx
const overviewSubPage = SubPageBlueprint.make({
  name: 'overview',
  params: {
    path: 'overview',
    title: 'Overview',
    loader: () => import('./components/Overview').then(m => <m.Overview />),
  },
});
```

The adapter belongs in the lazily loaded component module. Wrap the page's existing JSX directly; only hooks that consume this router need to be in a child beneath it.

```tsx title="./components/Overview.tsx"
import { ReactRouterV7PageRouter } from '@backstage/plugin-app-react-router-v7';

export function Overview() {
  return (
    <ReactRouterV7PageRouter>
      {/* Existing page JSX and local routes go here. */}
    </ReactRouterV7PageRouter>
  );
}
```

An adapter declared here scopes itself to the **sub-page**, because the
sub-page's app node is in context when its content renders. A React Router `<Routes>` tree inside that content is therefore written
relative to the sub-page, not to the page, and a relative `Link` resolves from
the sub-page.

A page that has sub-pages owns no content region of its own, so there is nothing
above the sub-pages for a page-level router to wrap. Each sub-page picks its own
library, and sibling tabs may pick different ones — a React Router v6 tab beside
a TanStack tab is a supported combination, in either direction. A tab that
declares no adapter still has working framework links.

Router-owned state belongs to the sub-page that declared the router, so it is
rebuilt when the active tab changes. The surrounding page shell — header, tabs,
breadcrumbs — stays mounted throughout, and is framework-owned, so it needs no
routing library at all.

## Use React Aria components directly

Use `RouterLink` from `@backstage/frontend-plugin-api` to connect custom React Aria
components to Backstage routing. It is a routing primitive with no styles, intended for
composition. For standard UI links, use the BUI `Link` component.

Pass `RouterLink` through React Aria's `render` prop:

```tsx
import { RouterLink } from '@backstage/frontend-plugin-api';
import { Link } from 'react-aria-components';

export function ToolDetailsLink() {
  return (
    <Link
      href="/tools/details"
      render={props =>
        'href' in props ? <RouterLink {...props} /> : <span {...props} />
      }
    >
      Tool details
    </Link>
  );
}
```

`RouterLink` uses framework routing, even inside a page adapter. Pass an
app-absolute destination, such as `/tools/details`, or a path generated by
`useRouteRef`. It handles the deployment basename and preserves browser behavior
for modified clicks, downloads, and external destinations. No `RouterProvider`
or custom click handler is needed. Without app history, links use browser navigation.
For library-relative destinations in custom React Aria components, compose with
that library's own link primitive instead.

The same approach works for navigable tabs:

```tsx
import {
  RouterLink,
  useAppLocation,
  useAppHref,
} from '@backstage/frontend-plugin-api';
import { Tabs, TabList, Tab } from 'react-aria-components';

export function ToolTabs() {
  const location = useAppLocation();
  const currentHref = useAppHref(location.pathname);
  const detailsHref = useAppHref('/tools/details');

  const selectedKey = currentHref === detailsHref ? 'details' : 'overview';

  return (
    <Tabs selectedKey={selectedKey}>
      <TabList aria-label="Tool">
        <Tab
          id="overview"
          href="/tools"
          render={props =>
            'href' in props ? <RouterLink {...props} /> : <div {...props} />
          }
        >
          Overview
        </Tab>
        <Tab
          id="details"
          href="/tools/details"
          render={props =>
            'href' in props ? <RouterLink {...props} /> : <div {...props} />
          }
        >
          Details
        </Tab>
      </TabList>
    </Tabs>
  );
}
```

The example compares
browser-ready paths so the deployment basename matches. It selects Details on an exact
path match and Overview otherwise.
Derive selection from your route structure when tabs also include descendant
routes. The page router renders the destination content, while the current
location controls tab selection, including after Back and Forward navigation.

For navigable menu items, use the same `render` pattern on `MenuItem`. Forward
all supplied props and the ref so React Aria retains its accessibility, focus,
and interaction behavior. Use a link with button styling for navigation that
looks like a button; keep action buttons as buttons.

## Migrate Backstage UI routing

Backstage apps configure Backstage UI (BUI) navigation automatically. Standalone
apps that relied on an ambient React Router must provide the `useRouter` prop
on `BUIProvider`. React Router is no longer a BUI peer dependency.
Legacy core-components, including the sidebar, continue using React Router
and require the implicit React Router compatibility provided by the app.

The hook returns a `BUIRouter` with three members:

- `resolveHref` resolves a target to a browser href.
- `navigate` navigates to that target and accepts `replace` and `state` options.
- `pathname` contains the current browser pathname.

The hook runs at each consuming control. Both callbacks must interpret relative
targets from that control's route scope. Resolved hrefs and `pathname` must
include the deployment basename. Nested BUI providers inherit the enclosing
hook. Without a hook, controls use an explicitly supplied React Aria
`RouterProvider` from the same installation, or native browser navigation.

When upgrading an existing integration:

1. Upgrade the app's BUI provider before upgrading separately bundled BUI components.
   Backstage apps retain the V2 React Router integration for older components.
   New providers preserve V2 through nesting, independently of the new routing hook.
1. Replace router-specific `routerOptions` with the supported `replace` and
   `state` options.
1. Use app-absolute paths or route-ref destinations outside an adapter.
   Within an adapter, BUI controls also accept library-relative paths.
   An empty target resolves to the current pathname, clearing query and hash.
1. Compose directly used React Aria components with `RouterLink`, as
   described in [React Aria integration](#use-react-aria-components-directly).

BUI links treat URL schemes, including custom and mixed-case schemes, as
external destinations. A scheme appearing only in a query string or fragment
does not make the link external. Targets using `javascript:`, `data:`, or
`vbscript:` instead become inert `about:blank` links and produce a console
warning. This applies to all BUI components that accept hrefs, including links
read from catalog annotations or other data.

Replace `javascript:` links with `onClick` handlers. For `data:` links, display
the content directly or create a blob URL for the download. Other schemes use
native browser navigation.

## Verify it works

Render the page in a test app and navigate through the returned `appHistory`:

```tsx title="plugins/tools/src/alpha.test.tsx"
import { renderTestApp } from '@backstage/frontend-test-utils';
import { screen } from '@testing-library/react';

it('renders the tools page under a TanStack router', async () => {
  const { appHistory } = renderTestApp({
    extensions: [toolsPage],
    initialRouteEntries: ['/tools'],
  });

  expect(await screen.findByText('Tools')).toBeInTheDocument();

  appHistory.navigate('/tools/details');

  expect(await screen.findByText('Tool details')).toBeInTheDocument();
});
```

If the page renders but navigation does not move it, check that the content
navigates with the page router's own APIs or with `useAppNavigate` from
`@backstage/frontend-plugin-api`, rather than writing to `window.history`
directly.

## Support for other libraries

The three adapters above are the supported ones, and they are maintained in the
Backstage repository. Adapters are not a plugin-side extension point: the mount
an adapter scopes itself to is read from framework internals rather than from
`@backstage/frontend-plugin-api`, so adding a library is a contribution to
Backstage rather than something a plugin writes for itself.

If your plugin needs a library that is not covered here, open an issue. The
existing adapters are small, and their source in `plugins/app-react-router-v6`,
`plugins/app-react-router-v7` and `plugins/app-tanstack-router` is the reference
for what a new one does:

- Project the app's history and the page's mount into the library's own history
  interface, and never call `window.history.pushState` or `replaceState`.
- Build no routes of its own for sub-pages. The framework's route matching, one
  level above the page, has already decided which sub-page is showing, so the
  content an adapter is handed is opaque.
- Render `children` untouched when either the mount or the history is missing,
  so the adapter stays inert wherever there is nothing to scope to.

## Prefer framework routing for shared components

Pages that only render content, follow links, or read query parameters do not
need a page adapter. Use `useAppLocation` for the app-absolute location and
`useAppSearchParams` for query state. These hooks subscribe to the shared app
history and fall back to React Router in the old frontend system.

Use `useRouteRefParams` with a route reference for framework route parameters,
and `useAppNavigate` for app-absolute or route-relative navigation. Keep a library adapter when
content renders that library's nested routes, outlets, or other library-specific
features. Declaring an adapter for a shared link or query hook alone is unnecessary.

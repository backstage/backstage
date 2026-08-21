---
id: page-routers
title: Choose a Router for a Page
sidebar_label: Page Routers
description: Render a page with React Router v7, TanStack Router, or another router library
---

Every page in the new frontend system renders inside a _page router_, a component
that supplies routing context scoped to that page's own path. The framework
mounts one router around the active page content. The default is React Router
v6, so a page that does nothing special keeps working with the React Router APIs
it already uses.

Use a page router adapter when a page is built on React Router v7, TanStack
Router, or another library. For the reasoning behind page-scoped routing, see
[Scoped plugin routing](../architecture/36-routes.md#scoped-plugin-routing).

:::note
Selecting a different page router changes only the library that renders the
selected page or sub-page content. The app still owns browser history, and
navigation between plugins still goes through `AppHistoryApi`.
:::

The framework selects the router before it renders the active content. An
explicit sub-page router takes priority over the page router, which takes
priority over the app default. This selection keeps adapters from nesting: an
override replaces the adapter that would otherwise render the content.

## Before you start

You need a page or sub-page extension to attach the router to. Note its extension
ID, which follows the
[naming patterns](../architecture/50-naming-patterns.md) for extensions: an
index page in a plugin called `tools` has the ID `page:tools`, a named page in
the same plugin has the ID `page:tools/reports`, and an `overview` sub-page has
the ID `sub-page:tools/overview`.

## Use React Router v7

Add the adapter package to your plugin:

```shell
yarn --cwd plugins/<plugin-name> add @backstage/plugin-app-react-router-v7
```

The package expects `react-router` and `react-router-dom` version 7 as peer
dependencies, so install those too if your plugin does not already have them.

Attach the router with `PageRouterBlueprint`:

```tsx title="plugins/tools/src/alpha.tsx"
import { PageRouterBlueprint } from '@backstage/frontend-plugin-api';
import { ReactRouterV7PageRouter } from '@backstage/plugin-app-react-router-v7';

const toolsPageRouter = PageRouterBlueprint.make({
  name: 'react-router-v7',
  attachTo: { id: 'page:tools', input: 'router' },
  params: { component: ReactRouterV7PageRouter },
});
```

Then add `toolsPageRouter` to the `extensions` array of your plugin. The page's
content renders inside a v7 context bound to the page's own mount path, so
relative `Link` targets, nested `<Routes>`, and `useParams` all resolve against
the page rather than against the app root.

## Use TanStack Router

Add the adapter package:

```shell
yarn --cwd plugins/<plugin-name> add @backstage/plugin-app-tanstack-router
```

This package expects `@tanstack/react-router` and `@tanstack/history` as peer
dependencies.

How you attach it depends on whether your page has a route tree of its own.

### Render page content as-is

`TanStackPageRouter` renders whatever the page produces through a catch-all
route. Use it when you want TanStack to own the page's routing context but the
page content itself does not declare TanStack routes:

```tsx title="plugins/tools/src/alpha.tsx"
import { PageRouterBlueprint } from '@backstage/frontend-plugin-api';
import { TanStackPageRouter } from '@backstage/plugin-app-tanstack-router';

const toolsPageRouter = PageRouterBlueprint.make({
  name: 'tanstack',
  attachTo: { id: 'page:tools', input: 'router' },
  params: { component: TanStackPageRouter },
});
```

### Bind a nested route tree

When your plugin owns a TanStack route tree, build an adapter with
`createTanStackPageRouter` instead. Render `TanStackPageContent` at the point in
the tree where the framework's page element belongs:

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
  component: () => <ToolDetails />,
});

const routeTree = rootRoute.addChildren([detailsRoute]);

export const ToolsPageRouter = createTanStackPageRouter({
  createRouter: ({ history }) => createRouter({ routeTree, history }),
});
```

The `history` passed to `createRouter` is scoped to the page and backed by the
app's history, so TanStack navigation and app navigation stay on the same
timeline. Attach `ToolsPageRouter` with `PageRouterBlueprint` the same way as
above. TanStack types stay inside the adapter package and your plugin, so
nothing leaks into the framework's public contract.

## Choose a router for a sub-page

Sub-pages inherit their page's router when their `router` input is empty. The
page router stays mounted at page scope across those sub-pages and keeps its
router state when the active tab changes.

The inherited router's native APIs remain page-scoped too. For example, a
React Router `<Routes>` tree inside an `overview` sub-page must include the
`overview` path, and a relative React Router `Link` resolves from the page
route. Use `useHref` or `RouteLink` from `@backstage/frontend-plugin-api` for
links that should resolve from the selected sub-page. If the content needs its
routing library's native APIs to use the sub-page as their root, attach an
explicit adapter to that sub-page instead.

Attach an adapter to a sub-page when it needs a different router library or a
new instance of the page's router scoped to the sub-page. The sub-page adapter
replaces the page adapter around the active content; the two adapters are not
nested:

```tsx
const overviewRouter = PageRouterBlueprint.make({
  name: 'react-router-v7',
  attachTo: { id: 'sub-page:tools/overview', input: 'router' },
  params: { component: ReactRouterV7PageRouter },
});
```

For example, selecting this sub-page on a React Router v6 page mounts React
Router v7 around the sub-page content. Returning to a sibling with no override
mounts the page's React Router v6 adapter again. Router-owned state resets when
the page adapter is mounted again; the surrounding page shell stays mounted.

## Change the app-wide default

App integrators can replace the default page router for every page at once by
overriding `pageRouterApiRef`. Page overrides take priority over that default,
and explicit sub-page overrides take priority over the page.

```tsx title="packages/app/src/App.tsx"
import {
  ApiBlueprint,
  createFrontendModule,
  pageRouterApiRef,
} from '@backstage/frontend-plugin-api';
import { TanStackPageRouter } from '@backstage/plugin-app-tanstack-router';

const tanStackDefault = createFrontendModule({
  pluginId: 'app',
  extensions: [
    ApiBlueprint.make({
      name: 'page-router',
      params: defineParams =>
        defineParams({
          api: pageRouterApiRef,
          deps: {},
          factory: () => TanStackPageRouter,
        }),
    }),
  ],
});
```

## Verify it works

Render the page in a test app and navigate through the returned `appHistory`:

```tsx title="plugins/tools/src/alpha.test.tsx"
import { renderTestApp } from '@backstage/frontend-test-utils';
import { screen } from '@testing-library/react';

it('renders the tools page under a TanStack router', async () => {
  const { appHistory } = renderTestApp({
    extensions: [toolsPage, toolsPageRouter],
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

## Write your own adapter

An adapter is a React component that takes `children` and renders them inside
its library's routing context. The component type is `PageRouterComponent` from
`@backstage/frontend-plugin-api`. Two rules make an adapter behave:

- Read the app's history through `appHistoryApiRef` and project it into the
  library's own history interface. Never call `window.history.pushState` or
  `replaceState` from the adapter.
- Build no routes of its own for sub-pages. The framework's route matching, one
  level above the page, has already decided which sub-page is showing.

The page and sub-page `router` inputs let the framework select an adapter before
it renders the content. A wrapper inside page content cannot replace the default
adapter because that adapter is already mounted by the time the wrapper
renders.

The packaged adapters are the reference implementations. Their source lives in
`plugins/app-react-router-v7` and `plugins/app-tanstack-router`.

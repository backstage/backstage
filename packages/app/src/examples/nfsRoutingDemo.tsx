/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Adopter-facing demo of library-agnostic {@link RouteDescriptor} trees on
 * `PageBlueprint` pages (RFC #33603).
 *
 * Three live sibling pages share the exact same descriptor tree
 * (`createNfsDemoRoutes`) and only differ in which page router adapter is
 * attached to their `router` input:
 *
 * | Path                          | Adapter                     |
 * | ------------------------------ | ---------------------------- |
 * | `/nfs-routing-demo`            | React Router v6 (explicit)  |
 * | `/nfs-routing-demo-v7`         | React Router v7             |
 * | `/nfs-routing-demo-tanstack`   | TanStack Router             |
 *
 * Each page attaches its adapter via `PageRouterBlueprint` — there is no
 * app-wide default swap. See
 * `plugins/react-router-v7-adapter/src/multiRouterCoexistence.test.tsx`
 * for the same page-scoped override pattern under test.
 *
 * See https://github.com/backstage/backstage/issues/33603
 */

import {
  PageBlueprint,
  PageRouterBlueprint,
  RouteDescriptor,
  createRouteDescriptor,
  createRouteRef,
} from '@backstage/frontend-plugin-api';
import { ReactRouterV6PageRouter } from '@backstage/plugin-react-router-v6-adapter';
import { ReactRouterV7PageRouter } from '@backstage/plugin-react-router-v7-adapter';
import { TanStackPageRouter } from '@backstage/plugin-tanstack-router-adapter';
import Typography from '@material-ui/core/Typography';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';

/** Label for the adapter a given sibling page is running under. */
type NfsDemoAdapterLabel =
  | 'React Router v6'
  | 'React Router v7'
  | 'TanStack Router';

function OverviewPanel({ adapter }: { adapter: NfsDemoAdapterLabel }) {
  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom>
        Overview
      </Typography>
      <Typography paragraph>
        This tab is declared with <code>createRouteDescriptor</code> — a
        library-agnostic route tree compiled by the active page router adapter.
        This page is wired to the <strong>{adapter}</strong> page router via{' '}
        <code>PageRouterBlueprint</code>.
      </Typography>
      <Typography paragraph>
        Parent RFC:{' '}
        <a href="https://github.com/backstage/backstage/issues/33603">#33603</a>
      </Typography>
    </div>
  );
}

function NestedPanel() {
  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom>
        Nested
      </Typography>
      <Typography paragraph>
        A second tab at a relative path (<code>nested</code>). PageLayout tabs
        and the page router share the same descriptor tree.
      </Typography>
    </div>
  );
}

function DetailPanel() {
  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom>
        Detail
      </Typography>
      <Typography paragraph>
        A third tab showing that multiple sibling descriptors compose into tabs
        without opaque React Router children in the page loader.
      </Typography>
    </div>
  );
}

/**
 * Builds the shared `overview` / `nested` / `detail` tab tree used by all
 * three sibling demo pages, so the same descriptors are proven under every
 * adapter. Only the `Overview` tab's copy differs, to name the adapter the
 * page is currently running under.
 */
function createNfsDemoRoutes(adapter: NfsDemoAdapterLabel): RouteDescriptor[] {
  return [
    createRouteDescriptor({
      id: 'overview',
      path: 'overview',
      title: 'Overview',
      loader: async () => <OverviewPanel adapter={adapter} />,
    }),
    createRouteDescriptor({
      id: 'nested',
      path: 'nested',
      title: 'Nested',
      loader: async () => <NestedPanel />,
    }),
    createRouteDescriptor({
      id: 'detail',
      path: 'detail',
      title: 'Detail',
      loader: async () => <DetailPanel />,
    }),
  ];
}

const nfsRoutingDemoRouteRef = createRouteRef();

/**
 * Sibling page at `/nfs-routing-demo`, explicitly wired to the React Router
 * v6 page adapter (the app-plugin default) via `PageRouterBlueprint`.
 */
export const NfsRoutingDemoPage = PageBlueprint.make({
  name: 'nfsRoutingDemo',
  params: {
    path: '/nfs-routing-demo',
    title: 'NFS Routing Demo (RR v6)',
    icon: <AccountTreeIcon />,
    routeRef: nfsRoutingDemoRouteRef,
    routes: createNfsDemoRoutes('React Router v6'),
  },
});

export const NfsRoutingDemoRouter = PageRouterBlueprint.make({
  name: 'nfsRoutingDemo-v6',
  attachTo: { id: 'page:pages/nfsRoutingDemo', input: 'router' },
  params: {
    component: ReactRouterV6PageRouter,
  },
});

const nfsRoutingDemoV7RouteRef = createRouteRef();

/**
 * Sibling page at `/nfs-routing-demo-v7`, wired to the React Router v7 page
 * adapter via `PageRouterBlueprint`.
 */
export const NfsRoutingDemoV7Page = PageBlueprint.make({
  name: 'nfsRoutingDemoV7',
  params: {
    path: '/nfs-routing-demo-v7',
    title: 'NFS Routing Demo (RR v7)',
    icon: <CallSplitIcon />,
    routeRef: nfsRoutingDemoV7RouteRef,
    routes: createNfsDemoRoutes('React Router v7'),
  },
});

export const NfsRoutingDemoV7Router = PageRouterBlueprint.make({
  name: 'nfsRoutingDemo-v7',
  attachTo: { id: 'page:pages/nfsRoutingDemoV7', input: 'router' },
  params: {
    component: ReactRouterV7PageRouter,
  },
});

const nfsRoutingDemoTanstackRouteRef = createRouteRef();

/**
 * Sibling page at `/nfs-routing-demo-tanstack`, wired to the TanStack Router
 * page adapter via `PageRouterBlueprint`.
 */
export const NfsRoutingDemoTanstackPage = PageBlueprint.make({
  name: 'nfsRoutingDemoTanstack',
  params: {
    path: '/nfs-routing-demo-tanstack',
    title: 'NFS Routing Demo (TanStack)',
    icon: <DeviceHubIcon />,
    routeRef: nfsRoutingDemoTanstackRouteRef,
    routes: createNfsDemoRoutes('TanStack Router'),
  },
});

export const NfsRoutingDemoTanstackRouter = PageRouterBlueprint.make({
  name: 'nfsRoutingDemo-tanstack',
  attachTo: { id: 'page:pages/nfsRoutingDemoTanstack', input: 'router' },
  params: {
    component: TanStackPageRouter,
  },
});

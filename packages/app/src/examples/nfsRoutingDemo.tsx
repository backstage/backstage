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
 * Adopter-facing demo of page router adapters (RFC #33603).
 *
 * Three live sibling pages only differ in which page router adapter is
 * attached to their `router` input via `PageRouterBlueprint`:
 *
 * | Path                          | Adapter                     |
 * | ------------------------------ | ---------------------------- |
 * | `/nfs-routing-demo`            | React Router v6 (app default) |
 * | `/nfs-routing-demo-v7`         | React Router v7               |
 * | `/nfs-routing-demo-tanstack`   | TanStack Router               |
 *
 * The React Router pages (v6, v7) compose the same tabbed sub-page
 * structure via `SubPageBlueprint` — `PageBlueprint` composes sub-pages into
 * a native React Router `<Routes>` tree, so the same tabs work unchanged
 * under either adapter (opaque children).
 *
 * TanStack Router fully owns its own route tree and cannot host that opaque
 * React Router content (no opaque-children bridge — see
 * `@backstage/plugin-tanstack-router-adapter`), so its sibling page renders
 * single, non-tabbed content via `loader` instead.
 *
 * See https://github.com/backstage/backstage/issues/33603
 */

import {
  PageBlueprint,
  PageRouterBlueprint,
  SubPageBlueprint,
  createRouteRef,
} from '@backstage/frontend-plugin-api';
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
        A second tab at a relative path (<code>nested</code>), composed as a
        sub-page via <code>SubPageBlueprint</code>.
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
        A third tab showing that multiple sibling sub-pages compose into tabs
        the same way under both React Router adapters.
      </Typography>
    </div>
  );
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
  },
});

export const NfsRoutingDemoOverview = SubPageBlueprint.make({
  name: 'nfsRoutingDemo-overview',
  attachTo: { id: 'page:pages/nfsRoutingDemo', input: 'pages' },
  params: {
    path: 'overview',
    title: 'Overview',
    loader: async () => <OverviewPanel adapter="React Router v6" />,
  },
});

export const NfsRoutingDemoNested = SubPageBlueprint.make({
  name: 'nfsRoutingDemo-nested',
  attachTo: { id: 'page:pages/nfsRoutingDemo', input: 'pages' },
  params: {
    path: 'nested',
    title: 'Nested',
    loader: async () => <NestedPanel />,
  },
});

export const NfsRoutingDemoDetail = SubPageBlueprint.make({
  name: 'nfsRoutingDemo-detail',
  attachTo: { id: 'page:pages/nfsRoutingDemo', input: 'pages' },
  params: {
    path: 'detail',
    title: 'Detail',
    loader: async () => <DetailPanel />,
  },
});

const nfsRoutingDemoV7RouteRef = createRouteRef();

/**
 * Sibling page at `/nfs-routing-demo-v7`, wired to the React Router v7 page
 * adapter via `PageRouterBlueprint`. Uses the same tabbed sub-page structure
 * as the v6 sibling to prove opaque children work the same under both.
 */
export const NfsRoutingDemoV7Page = PageBlueprint.make({
  name: 'nfsRoutingDemoV7',
  params: {
    path: '/nfs-routing-demo-v7',
    title: 'NFS Routing Demo (RR v7)',
    icon: <CallSplitIcon />,
    routeRef: nfsRoutingDemoV7RouteRef,
  },
});

export const NfsRoutingDemoV7Overview = SubPageBlueprint.make({
  name: 'nfsRoutingDemoV7-overview',
  attachTo: { id: 'page:pages/nfsRoutingDemoV7', input: 'pages' },
  params: {
    path: 'overview',
    title: 'Overview',
    loader: async () => <OverviewPanel adapter="React Router v7" />,
  },
});

export const NfsRoutingDemoV7Nested = SubPageBlueprint.make({
  name: 'nfsRoutingDemoV7-nested',
  attachTo: { id: 'page:pages/nfsRoutingDemoV7', input: 'pages' },
  params: {
    path: 'nested',
    title: 'Nested',
    loader: async () => <NestedPanel />,
  },
});

export const NfsRoutingDemoV7Detail = SubPageBlueprint.make({
  name: 'nfsRoutingDemoV7-detail',
  attachTo: { id: 'page:pages/nfsRoutingDemoV7', input: 'pages' },
  params: {
    path: 'detail',
    title: 'Detail',
    loader: async () => <DetailPanel />,
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
 * Sibling page at `/nfs-routing-demo-tanstack`, wired to the TanStack
 * Router page adapter via `PageRouterBlueprint`. TanStack fully owns its
 * route tree and has no opaque-children bridge, so this page renders single
 * content via `loader` rather than the tabbed `SubPageBlueprint` structure
 * used by the v6/v7 siblings.
 */
export const NfsRoutingDemoTanstackPage = PageBlueprint.make({
  name: 'nfsRoutingDemoTanstack',
  params: {
    path: '/nfs-routing-demo-tanstack',
    title: 'NFS Routing Demo (TanStack)',
    icon: <DeviceHubIcon />,
    routeRef: nfsRoutingDemoTanstackRouteRef,
    loader: async () => <OverviewPanel adapter="TanStack Router" />,
  },
});

export const NfsRoutingDemoTanstackRouter = PageRouterBlueprint.make({
  name: 'nfsRoutingDemo-tanstack',
  attachTo: { id: 'page:pages/nfsRoutingDemoTanstack', input: 'router' },
  params: {
    component: TanStackPageRouter,
  },
});

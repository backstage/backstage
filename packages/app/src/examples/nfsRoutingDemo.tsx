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

import {
  PageBlueprint,
  SubPageBlueprint,
} from '@backstage/frontend-plugin-api';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import {
  V6_PAGE_PATH,
  TANSTACK_PAGE_PATH,
  V7_PAGE_PATH,
  nfsRoutingDemoRouteRef,
  nfsRoutingDemoTanstackRouteRef,
  nfsRoutingDemoV7RouteRef,
  nestedV6RouteRef,
  deepLinkRouteRef,
  tanstackV6GuestRouteRef,
  v7V6GuestRouteRef,
} from './nfsRoutingDemoRoutes';
/**
 * `/nfs-routing-demo` — a tabbed page, so it owns no content region of its own
 * and declares no adapter. Each tab below picks its own library.
 */
const V6HostPage = PageBlueprint.make({
  name: 'nfsRoutingDemo',
  params: {
    path: V6_PAGE_PATH,
    title: 'NFS Routing (React Router v6 host)',
    icon: <AccountTreeIcon />,
    routeRef: nfsRoutingDemoRouteRef,
  },
});

const V6HostNestedSubPage = SubPageBlueprint.make({
  name: 'nfsRoutingDemo-nested-v6',
  attachTo: { id: 'page:pages/nfsRoutingDemo', input: 'pages' },
  params: {
    path: 'nested-v6',
    title: 'v6 in v6',
    routeRef: nestedV6RouteRef,
    loader: () =>
      import('./nfsRoutingDemoPages').then(m => <m.NestedV6PanelPage />),
  },
});

const V6HostTanStackSubPage = SubPageBlueprint.make({
  name: 'nfsRoutingDemo-tanstack',
  attachTo: { id: 'page:pages/nfsRoutingDemo', input: 'pages' },
  params: {
    path: 'tanstack',
    title: 'TanStack guest',
    loader: () =>
      import('./nfsRoutingDemoPages').then(m => <m.TanStackGuestPanelPage />),
  },
});

const V6HostUnscopedSubPage = SubPageBlueprint.make({
  name: 'nfsRoutingDemo-unscoped',
  attachTo: { id: 'page:pages/nfsRoutingDemo', input: 'pages' },
  params: {
    path: 'unscoped',
    title: 'Implicit compatibility',
    // Deliberately no adapter: this tab demonstrates implicit v6 compatibility.
    loader: () =>
      import('./nfsRoutingDemoPages').then(m => <m.UnscopedPanel />),
  },
});

const V6HostDeepLinkSubPage = SubPageBlueprint.make({
  name: 'nfsRoutingDemo-deep-link',
  attachTo: { id: 'page:pages/nfsRoutingDemo', input: 'pages' },
  params: {
    path: 'deep-link',
    title: 'Deep links',
    routeRef: deepLinkRouteRef,
    loader: () =>
      import('./nfsRoutingDemoPages').then(m => <m.DeepLinkPanelPage />),
  },
});

/** `/nfs-routing-demo-tanstack` — tabs that lead with TanStack Router. */
const TanStackHostPage = PageBlueprint.make({
  name: 'nfsRoutingDemoTanstack',
  params: {
    path: TANSTACK_PAGE_PATH,
    title: 'NFS Routing (TanStack host)',
    icon: <DeviceHubIcon />,
    routeRef: nfsRoutingDemoTanstackRouteRef,
  },
});

const TanStackHostTanStackSubPage = SubPageBlueprint.make({
  name: 'nfsRoutingDemoTanstack-tanstack',
  attachTo: { id: 'page:pages/nfsRoutingDemoTanstack', input: 'pages' },
  params: {
    path: 'tanstack',
    title: 'TanStack tabs',
    loader: () =>
      import('./nfsRoutingDemoPages').then(m => <m.TanStackTabsPanelPage />),
  },
});

const TanStackHostV6SubPage = SubPageBlueprint.make({
  name: 'nfsRoutingDemoTanstack-v6-guest',
  attachTo: { id: 'page:pages/nfsRoutingDemoTanstack', input: 'pages' },
  params: {
    path: 'v6-guest',
    title: 'v6 guest',
    routeRef: tanstackV6GuestRouteRef,
    loader: () =>
      import('./nfsRoutingDemoPages').then(m => <m.TanStackV6GuestPanelPage />),
  },
});

/** `/nfs-routing-demo-v7` — tabs that lead with the React Router v7 adapter. */
const V7HostPage = PageBlueprint.make({
  name: 'nfsRoutingDemoV7',
  params: {
    path: V7_PAGE_PATH,
    title: 'NFS Routing (React Router v7 host)',
    icon: <CallSplitIcon />,
    routeRef: nfsRoutingDemoV7RouteRef,
  },
});

const V7HostV6SubPage = SubPageBlueprint.make({
  name: 'nfsRoutingDemoV7-v6-guest',
  attachTo: { id: 'page:pages/nfsRoutingDemoV7', input: 'pages' },
  params: {
    path: 'v6-guest',
    title: 'v6 guest',
    routeRef: v7V6GuestRouteRef,
    loader: () =>
      import('./nfsRoutingDemoPages').then(m => <m.V7V6GuestPanelPage />),
  },
});

const V7HostV7SubPage = SubPageBlueprint.make({
  name: 'nfsRoutingDemoV7-v7-only',
  attachTo: { id: 'page:pages/nfsRoutingDemoV7', input: 'pages' },
  params: {
    path: 'v7-only',
    title: 'v7 only',
    loader: () =>
      import('./nfsRoutingDemoPages').then(m => <m.V7OnlyPanelPage />),
  },
});

/**
 * Every extension the demo contributes, in the order the tabs should appear.
 */
export const nfsRoutingDemoExtensions = [
  V6HostPage,
  V6HostNestedSubPage,
  V6HostTanStackSubPage,
  V6HostDeepLinkSubPage,
  V6HostUnscopedSubPage,
  TanStackHostPage,
  TanStackHostTanStackSubPage,
  TanStackHostV6SubPage,
  V7HostPage,
  V7HostV6SubPage,
  V7HostV7SubPage,
];

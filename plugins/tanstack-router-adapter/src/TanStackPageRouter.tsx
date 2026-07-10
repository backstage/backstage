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

import type { ReactNode } from 'react';
import type {
  RouteDescriptor,
  RoutingContract,
} from '@backstage/frontend-plugin-api';
import { TanStackRouterHost } from './TanStackRouterHost';

/**
 * TanStack Router page adapter. Compiles route descriptor trees into a TanStack
 * route tree and projects the page routing contract into a hand-rolled history.
 * Never writes `window.history` via push/replace.
 *
 * Register as a page override via `PageRouterBlueprint`, or as the
 * `pageRouterApiRef` default.
 *
 * Opaque React Router children are not supported — pages must declare in-page
 * routes as descriptors (or render TanStack-native content under a descriptor
 * tree).
 *
 * Back/forward uses the contract's `go`; `canGoBack` / `historyLength` come from
 * the contract. TanStack `__TSR_*` metadata is stored under the
 * `tanstack-router` adapterState namespace.
 *
 * @public
 */
export function TanStackPageRouter(props: {
  contract: RoutingContract;
  routePattern: string;
  appBasename?: string;
  routes?: readonly RouteDescriptor[];
  children: ReactNode;
}) {
  return <TanStackRouterHost {...props} />;
}

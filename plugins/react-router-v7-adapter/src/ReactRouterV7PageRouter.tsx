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
import { ScopedRouterHost } from './ScopedRouterHost';
import { createScopedRouter } from './createScopedRouter';
import { withCompiledRouteDescriptors } from './compileRouteDescriptors';

/**
 * React Router v7 page adapter. Injects library context from the page's
 * RoutingContract and never writes `window.history` via push/replace/go.
 *
 * When `routes` is provided, compiles the RouteDescriptor tree into
 * React Router routes. Opaque `children` remain supported when `routes` is
 * omitted (expand-contract path).
 *
 * Back/forward uses RoutingContract.go on the contract.
 *
 * Attach via PageRouterBlueprint to a page's optional `router` input to
 * override the app-plugin default.
 *
 * @public
 */
export function ReactRouterV7PageRouter(props: {
  contract: RoutingContract;
  routePattern: string;
  appBasename?: string;
  routes?: readonly RouteDescriptor[];
  children: ReactNode;
}) {
  return (
    <ScopedRouterHost
      {...props}
      createScopedRouter={createScopedRouter}
      withCompiledRouteDescriptors={withCompiledRouteDescriptors}
    />
  );
}

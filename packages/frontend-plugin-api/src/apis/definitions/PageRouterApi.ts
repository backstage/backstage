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

import { ComponentType, ReactNode } from 'react';
import { createApiRef } from '../system';
import type { RoutingContract } from '../../routing/RoutingContract';
import type { RouteDescriptor } from '../../routing/RouteDescriptor';

/**
 * A page-level router adapter that injects library routing context from a
 * {@link RoutingContract} without owning browser history.
 *
 * When `routes` is provided, the adapter compiles the library-agnostic
 * {@link RouteDescriptor} tree into its native route elements. Opaque
 * `children` (e.g. existing React Router `<Routes>`) remain supported when
 * `routes` is omitted.
 *
 * @public
 */
export type PageRouterComponent = ComponentType<{
  contract: RoutingContract;
  routePattern: string;
  appBasename?: string;
  /**
   * Optional in-page route tree. When set, the adapter compiles these
   * descriptors and renders them as the page's routed content (typically
   * injected as children of the single React child, e.g. PageLayout).
   */
  routes?: readonly RouteDescriptor[];
  children: ReactNode;
}>;

/**
 * Capability flags describing what the router adapter returned from
 * {@link PageRouterApi.getDefaultRouter} can render.
 *
 * @public
 */
export interface PageRouterCapabilities {
  /**
   * Whether the adapter can render opaque `children` (e.g. existing React
   * Router `<Routes>` composed inside a `PageBlueprint` `loader`) when no
   * `routes` descriptors are supplied.
   *
   * Adapters that compile {@link RouteDescriptor} trees into a native route
   * tree that fully owns rendering (e.g. TanStack Router) cannot host opaque
   * React Router children and should report `false`. Pages must then declare
   * in-page routing as `RouteDescriptor` trees (`PageBlueprint` `routes`, or
   * the `pages` input via `SubPageBlueprint`) instead.
   *
   * Defaults to `true` (opaque children supported) when the adapter omits
   * this capability entirely.
   */
  supportsOpaqueChildren?: boolean;
}

/**
 * API that supplies the default page router adapter when a page does not
 * override the optional `router` extension input.
 *
 * Implementations live in adapter packages (e.g. React Router v6) and are
 * registered by the app plugin. Core page blueprints depend only on this API,
 * not on any specific router library.
 *
 * @public
 */
export interface PageRouterApi {
  /**
   * Returns a React component that wraps page content with the default
   * router adapter for the given contract and route pattern.
   */
  getDefaultRouter(): PageRouterComponent;
  /**
   * Optional capability surface for the router adapter returned by
   * {@link PageRouterApi.getDefaultRouter}. `PageBlueprint` consults this to
   * fail fast when a page relies on opaque children that the active default
   * adapter cannot render — see
   * {@link PageRouterCapabilities.supportsOpaqueChildren}.
   */
  getCapabilities?(): PageRouterCapabilities;
}

/**
 * The API reference of {@link PageRouterApi}.
 *
 * @public
 */
export const pageRouterApiRef = createApiRef<PageRouterApi>().with({
  id: 'core.page-router',
  pluginId: 'app',
});

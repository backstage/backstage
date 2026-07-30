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

/**
 * A page-level router adapter that injects library routing context for its
 * `children`, without owning browser history.
 *
 * `children` are opaque — typically a native React Router `<Routes>` tree
 * (or arbitrary content) composed by `PageBlueprint` / `SubPageBlueprint`.
 * The adapter's job is only to provide routing context scoped to `basePath`
 * so `children` can resolve locations, links, and nested routes correctly.
 *
 * @public
 */
export type PageRouterComponent = ComponentType<{
  /** Concrete app-absolute URL prefix this page is mounted at. */
  basePath: string;
  /** Registered route pattern this page is mounted at. */
  routePattern: string;
  /** App deploy basename (e.g. `/backstage`), if any. */
  appBasename?: string;
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
   * Whether the adapter can render opaque `children` (e.g. a React Router
   * `<Routes>` tree composed by `PageBlueprint` / `SubPageBlueprint`).
   *
   * Adapters that fully own rendering via their own compiled route tree
   * (e.g. TanStack Router) cannot host opaque React Router children and
   * should report `false`.
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
   * router adapter for the given base path.
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

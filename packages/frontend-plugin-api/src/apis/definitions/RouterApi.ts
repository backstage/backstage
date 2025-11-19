/*
 * Copyright 2024 The Backstage Authors
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

import { ComponentType, ReactElement, ReactNode } from 'react';
import { createApiRef } from '../system';
import {
  Location,
  To,
  Path,
  NavigateFunction,
  RouteObject,
  RouteMatch,
  LinkProps,
  NavLinkProps,
  NavigateProps,
} from '../../routing';

/**
 * API for router operations and components.
 *
 * This API provides router-agnostic access to router primitives,
 * with an API surface matching react-router v6 for familiarity.
 * The default implementation uses React Router 6, but custom
 * implementations can be provided for other routers (e.g., TanStack Router).
 *
 * @remarks
 * Users should generally NOT import hooks or components directly from this API.
 * Instead, import them from `@backstage/frontend-plugin-api`:
 *
 * ```tsx
 * // Hooks
 * import { useLocation, useParams, useNavigate } from '@backstage/frontend-plugin-api';
 *
 * // Components
 * import { Link, NavLink, Routes, Route, Outlet } from '@backstage/frontend-plugin-api';
 * ```
 *
 * The RouterApi is primarily intended for:
 * - Internal use by the routing hooks and component wrappers
 * - Custom router implementations
 * - Advanced use cases requiring direct router access
 *
 * @public
 */
export interface RouterApi {
  // === Provider Component (rendered by app shell) ===

  /**
   * Router component that sets up router context.
   * Wraps the app with BrowserRouter (or equivalent) and context provider.
   */
  Router: ComponentType<{ children: ReactNode; basePath: string }>;

  // === Static Functions (used internally, no React context required) ===

  matchRoutes: <T extends RouteObject>(
    routes: T[],
    location: { pathname: string },
  ) => RouteMatch<T>[] | null;

  generatePath: (
    path: string,
    params?: Record<string, string | undefined>,
  ) => string;

  resolvePath: (to: To, fromPathname?: string) => Path;

  // === Hooks (used internally by wrapper hooks) ===
  // Users should import useLocation, useParams, useNavigate, etc. from
  // @backstage/frontend-plugin-api, NOT from this API directly.
  // These are exposed here for the wrapper hooks to use.

  useLocation: () => Location;

  useParams: <
    T extends Record<string, string | undefined> = Record<
      string,
      string | undefined
    >,
  >() => T;

  useNavigate: () => NavigateFunction;

  useSearchParams: () => [
    URLSearchParams,
    (
      nextInit: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
      navigateOptions?: { replace?: boolean; state?: unknown },
    ) => void,
  ];

  useResolvedPath: (to: To) => Path;

  useHref: (to: To) => string;

  useRoutes: (
    routes: RouteObject[],
    location?: Partial<Location> | string,
  ) => ReactElement | null;

  useOutlet: (context?: unknown) => ReactElement | null;

  // === Components (used internally by wrapper components) ===
  // Users should import Link, NavLink, Routes, Route, Outlet from
  // @backstage/frontend-plugin-api, NOT from this API directly.
  // These are exposed here for the wrapper components to use.

  Link: ComponentType<LinkProps>;

  NavLink: ComponentType<NavLinkProps>;

  Outlet: ComponentType<{ context?: unknown }>;

  Navigate: ComponentType<NavigateProps>;
}

/**
 * API reference for the router API.
 * @public
 */
export const routerApiRef = createApiRef<RouterApi>({
  id: 'core.router',
});

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

import { ComponentType, ReactNode } from 'react';
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
  RouteProps,
} from '../../routing';

/**
 * API for router operations and components.
 *
 * This API provides router-agnostic access to router primitives,
 * with an API surface matching react-router v6 for familiarity.
 * The default implementation uses React Router 6, but custom
 * implementations can be provided for other routers (e.g., TanStack Router).
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

  /**
   * Match routes against a location pathname.
   * Used internally for route resolution.
   */
  matchRoutes: <T extends RouteObject>(
    routes: T[],
    location: { pathname: string },
  ) => RouteMatch<T>[] | null;

  /**
   * Generate a path from a pattern and params.
   * Used internally for route resolution.
   */
  generatePath: (
    path: string,
    params?: Record<string, string | undefined>,
  ) => string;

  // === Hooks (require Router context) ===

  /**
   * Returns the current location object.
   * Components calling this will re-render on location changes.
   */
  useLocation: () => Location;

  /**
   * Returns the current URL parameters.
   * Components calling this will re-render on param changes.
   */
  useParams: <
    T extends Record<string, string | undefined> = Record<
      string,
      string | undefined
    >,
  >() => T;

  /**
   * Returns a function to navigate programmatically.
   * The function reference is stable and won't cause re-renders.
   */
  useNavigate: () => NavigateFunction;

  /**
   * Returns the current search params and a function to update them.
   */
  useSearchParams: () => [
    URLSearchParams,
    (
      nextInit: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
      navigateOptions?: { replace?: boolean; state?: unknown },
    ) => void,
  ];

  /**
   * Resolves a relative path against the current location.
   */
  useResolvedPath: (to: To) => Path;

  /**
   * Returns the href string for a given destination.
   */
  useHref: (to: To) => string;

  // === Components (require Router context) ===

  /**
   * Navigation link component.
   * Renders an anchor tag that navigates on click.
   */
  Link: ComponentType<LinkProps>;

  /**
   * Navigation link with active state styling.
   * Provides isActive/isPending state for styling.
   */
  NavLink: ComponentType<NavLinkProps>;

  /**
   * Route definition component.
   * Defines a route that renders its element when the path matches.
   */
  Route: ComponentType<RouteProps>;

  /**
   * Routes container component.
   * Renders the first child Route that matches the current location.
   */
  Routes: ComponentType<{ children?: ReactNode; location?: Partial<Location> }>;

  /**
   * Outlet for nested routes.
   * Renders the child route's element at this position.
   */
  Outlet: ComponentType<{ context?: unknown }>;
}

/**
 * API reference for the router API.
 * @public
 */
export const routerApiRef = createApiRef<RouterApi>({
  id: 'core.router',
});

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
import {
  MemoryRouter,
  Routes as RRRoutes,
  Route as RRRoute,
  Link as RRLink,
  NavLink as RRNavLink,
  Outlet as RROutlet,
  useLocation as useRRLocation,
  useNavigate as useRRNavigate,
  useParams as useRRParams,
  useSearchParams as useRRSearchParams,
  useResolvedPath as useRRResolvedPath,
  useHref as useRRHref,
  matchRoutes as rrMatchRoutes,
  generatePath as rrGeneratePath,
  RouteObject as RRRouteObject,
  NavigateOptions as RRNavigateOptions,
} from 'react-router-dom';
import type {
  RouterApi,
  RouteObject,
  RouteMatch,
  Location,
  Path,
  To,
  NavigateFunction,
  LinkProps,
  NavLinkProps,
  RouteProps,
} from '@backstage/frontend-plugin-api';

/**
 * Adapts Backstage RouteObjects to React Router's format.
 * @internal
 */
function adaptRouteObjects<T extends RouteObject>(
  routes: T[],
): RRRouteObject[] {
  return routes as unknown as RRRouteObject[];
}

/**
 * Adapts React Router's match result back to our RouteMatch format.
 * @internal
 */
function adaptRouteMatches<T extends RouteObject>(
  matches: ReturnType<typeof rrMatchRoutes>,
): RouteMatch<T>[] | null {
  return matches as unknown as RouteMatch<T>[] | null;
}

/**
 * Options for creating a MockRouterApi.
 * @public
 */
export interface MockRouterApiOptions {
  /** Initial entries for the memory router */
  initialEntries?: string[];
  /** Initial index in the history stack */
  initialIndex?: number;
}

/**
 * Mock implementation of RouterApi using MemoryRouter for testing.
 * @public
 */
export class MockRouterApi implements RouterApi {
  private initialEntries: string[];
  private initialIndex?: number;

  constructor(options?: MockRouterApiOptions) {
    this.initialEntries = options?.initialEntries ?? ['/'];
    this.initialIndex = options?.initialIndex;
  }

  Router: ComponentType<{ children: ReactNode; basePath: string }> = ({
    children,
  }) => (
    <MemoryRouter
      initialEntries={this.initialEntries}
      initialIndex={this.initialIndex}
    >
      {children}
    </MemoryRouter>
  );

  matchRoutes<T extends RouteObject>(
    routes: T[],
    location: { pathname: string },
  ): RouteMatch<T>[] | null {
    const rrRoutes = adaptRouteObjects(routes);
    const matches = rrMatchRoutes(rrRoutes, location);
    return adaptRouteMatches<T>(matches);
  }

  generatePath(
    path: string,
    params?: Record<string, string | undefined>,
  ): string {
    return rrGeneratePath(path, params);
  }

  useLocation(): Location {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const loc = useRRLocation();
    return {
      pathname: loc.pathname,
      search: loc.search,
      hash: loc.hash,
      state: loc.state,
      key: loc.key,
    };
  }

  useParams<T extends Record<string, string | undefined>>(): T {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRRParams() as T;
  }

  useNavigate(): NavigateFunction {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useRRNavigate();
    return ((to: To | number, options?: RRNavigateOptions) => {
      if (typeof to === 'number') {
        navigate(to);
      } else {
        navigate(to, options);
      }
    }) as NavigateFunction;
  }

  useSearchParams() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRRSearchParams();
  }

  useResolvedPath(to: To): Path {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRRResolvedPath(to);
  }

  useHref(to: To): string {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRRHref(to);
  }

  Link = RRLink as ComponentType<LinkProps>;
  NavLink = RRNavLink as ComponentType<NavLinkProps>;
  Route = RRRoute as unknown as ComponentType<RouteProps>;
  Routes = RRRoutes as RouterApi['Routes'];
  Outlet = RROutlet as RouterApi['Outlet'];
}

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
import {
  generatePath as rrGeneratePath,
  Link as RRLink,
  matchRoutes as rrMatchRoutes,
  Navigate as RRNavigate,
  NavigateOptions as RRNavigateOptions,
  NavLink as RRNavLink,
  Outlet as RROutlet,
  resolvePath as rrResolvePath,
  RouteObject as RRRouteObject,
  useHref as useRRHref,
  useLocation as useRRLocation,
  useNavigate as useRRNavigate,
  useOutlet as useRROutlet,
  useParams as useRRParams,
  useResolvedPath as useRRResolvedPath,
  useRoutes as useRRRoutes,
  useSearchParams as useRRSearchParams,
} from 'react-router-dom';
import type {
  RouterApi,
  RouteObject,
  RouteMatch,
  Location,
  Path,
  To,
  NavigateFunction,
} from '@backstage/frontend-plugin-api';

function adaptRouteObjects<T extends RouteObject>(
  routes: T[],
): RRRouteObject[] {
  return routes as unknown as RRRouteObject[];
}

function adaptRouteMatches<T extends RouteObject>(
  matches: ReturnType<typeof rrMatchRoutes>,
): RouteMatch<T>[] | null {
  return matches as unknown as RouteMatch<T>[] | null;
}

/**
 * Base RouterApi implementation backed by react-router-dom v6.
 * Subclasses must override `Router` with a concrete router component.
 *
 * @public
 */
export class BaseReactRouterV6Api implements RouterApi {
  Router: ComponentType<{ children: ReactNode; basePath: string }> = () => {
    throw new Error(
      'BaseReactRouterV6Api.Router must be overridden by a subclass',
    );
  };

  matchRoutes<T extends RouteObject>(
    routes: T[],
    location: { pathname: string },
  ): RouteMatch<T>[] | null {
    return adaptRouteMatches<T>(
      rrMatchRoutes(adaptRouteObjects(routes), location),
    );
  }

  generatePath(
    path: string,
    params?: Record<string, string | undefined>,
  ): string {
    return rrGeneratePath(path, params);
  }

  resolvePath(to: To, fromPathname?: string): Path {
    return rrResolvePath(to, fromPathname);
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

  useRoutes(
    routes: RouteObject[],
    location?: Partial<Location> | string,
  ): ReactElement | null {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRRRoutes(adaptRouteObjects(routes), location);
  }

  useOutlet(context?: unknown): ReactElement | null {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRROutlet(context);
  }

  Link = RRLink as RouterApi['Link'];
  NavLink = RRNavLink as RouterApi['NavLink'];
  Outlet = RROutlet as RouterApi['Outlet'];
  Navigate = RRNavigate as RouterApi['Navigate'];
}

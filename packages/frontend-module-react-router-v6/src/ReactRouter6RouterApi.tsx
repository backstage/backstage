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
  BrowserRouter,
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
  LinkProps,
  Location,
  NavigateFunction,
  NavLinkProps,
  Path,
  RouteMatch,
  RouteObject,
  RouterApi,
  To,
} from '@backstage/frontend-plugin-api';

/**
 * Adapts Backstage RouteObjects to React Router's format.
 * This is needed because our RouteObject type includes Backstage-specific
 * fields (routeRefs, appNode) that react-router doesn't know about.
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
 * React Router 6 implementation of the RouterApi.
 *
 * Hooks are implemented as lazy functions - the actual react-router hook
 * is only called when the consumer invokes the function. This ensures
 * components only re-render when they actually use the hook.
 *
 * @public
 */
export class ReactRouter6RouterApi implements RouterApi {
  /**
   * Router component that wraps children with BrowserRouter.
   */
  Router: ComponentType<{ children: ReactNode; basePath: string }> = ({
    children,
    basePath,
  }) => <BrowserRouter basename={basePath}>{children}</BrowserRouter>;

  // === Static functions - can be called outside React ===

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

  resolvePath(to: To, fromPathname?: string): Path {
    return rrResolvePath(to, fromPathname);
  }

  // === Hook implementations ===
  // These are function properties that call the underlying react-router hooks.
  // They are assigned as properties to match the RouterApi interface.

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
    const rrRoutes = adaptRouteObjects(routes);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRRRoutes(rrRoutes, location);
  }

  useOutlet(context?: unknown): ReactElement | null {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRROutlet(context);
  }

  // === Components ===

  Link = RRLink as ComponentType<LinkProps>;
  NavLink = RRNavLink as ComponentType<NavLinkProps>;
  Outlet = RROutlet as RouterApi['Outlet'];
  Navigate = RRNavigate as RouterApi['Navigate'];
}

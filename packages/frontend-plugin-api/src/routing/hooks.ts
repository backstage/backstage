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

import { ReactElement } from 'react';
import { useApi, routerApiRef } from '../apis';
import type {
  Location,
  To,
  Path,
  NavigateFunction,
  RouteObject,
  RouteMatch,
} from './routerTypes';

/**
 * Returns the current location object.
 *
 * @example
 * ```tsx
 * const location = useLocation();
 * console.log(location.pathname); // "/users/123"
 * ```
 *
 * @public
 */
export function useLocation(): Location {
  const routerApi = useApi(routerApiRef);
  return routerApi.useLocation();
}

/**
 * Returns the current URL parameters as an object.
 *
 * @example
 * ```tsx
 * // For route "/users/:id"
 * const { id } = useParams();
 * ```
 *
 * @public
 */
export function useParams<
  T extends Record<string, string | undefined> = Record<
    string,
    string | undefined
  >,
>(): T {
  const routerApi = useApi(routerApiRef);
  return routerApi.useParams<T>();
}

/**
 * Returns a function to navigate programmatically.
 *
 * @example
 * ```tsx
 * const navigate = useNavigate();
 * navigate('/home');
 * navigate('/login', { replace: true });
 * navigate(-1); // Go back
 * ```
 *
 * @public
 */
export function useNavigate(): NavigateFunction {
  const routerApi = useApi(routerApiRef);
  return routerApi.useNavigate();
}

/**
 * Returns the current search params and a function to update them.
 *
 * @example
 * ```tsx
 * const [searchParams, setSearchParams] = useSearchParams();
 * const query = searchParams.get('q');
 * setSearchParams({ q: 'new query' });
 * ```
 *
 * @public
 */
export function useSearchParams(): [
  URLSearchParams,
  (
    nextInit: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams),
    navigateOptions?: { replace?: boolean; state?: unknown },
  ) => void,
] {
  const routerApi = useApi(routerApiRef);
  return routerApi.useSearchParams();
}

/**
 * Resolves a relative path against the current location.
 *
 * @example
 * ```tsx
 * const resolved = useResolvedPath('../settings');
 * ```
 *
 * @public
 */
export function useResolvedPath(to: To): Path {
  const routerApi = useApi(routerApiRef);
  return routerApi.useResolvedPath(to);
}

/**
 * Returns the href string for a given destination.
 *
 * @example
 * ```tsx
 * const href = useHref('/about');
 * ```
 *
 * @public
 */
export function useHref(to: To): string {
  const routerApi = useApi(routerApiRef);
  return routerApi.useHref(to);
}

/**
 * Returns the element for the child route at this level of the route hierarchy.
 * Used for rendering nested route content programmatically.
 *
 * @example
 * ```tsx
 * function Layout() {
 *   const outlet = useOutlet();
 *   return (
 *     <div>
 *       <nav>...</nav>
 *       {outlet}
 *     </div>
 *   );
 * }
 * ```
 *
 * @public
 */
export function useOutlet(context?: unknown): ReactElement | null {
  const routerApi = useApi(routerApiRef);
  return routerApi.useOutlet(context);
}

/**
 * Renders routes from a RouteObject array.
 * This is the programmatic equivalent of using the Routes component.
 *
 * @example
 * ```tsx
 * const routes = [
 *   { path: '/', element: <Home /> },
 *   { path: '/about', element: <About /> },
 * ];
 * const element = useRoutes(routes);
 * ```
 *
 * @public
 */
export function useRoutes(
  routes: RouteObject[],
  location?: Partial<Location> | string,
): ReactElement | null {
  const routerApi = useApi(routerApiRef);
  return routerApi.useRoutes(routes, location);
}

/**
 * Resolves a path relative to another path.
 *
 * @remarks
 * Must be called within a React component or hook context.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const resolved = resolvePath('../settings', '/users/123');
 *   // resolved.pathname === '/users/settings'
 *   return <div>{resolved.pathname}</div>;
 * }
 * ```
 *
 * @public
 */
export function resolvePath(to: To, fromPathname?: string): Path {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const routerApi = useApi(routerApiRef);
  return routerApi.resolvePath(to, fromPathname);
}

/**
 * Match routes against a location pathname.
 *
 * @remarks
 * Must be called within a React component or hook context.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const routes = [{ path: '/users/:id', element: <User /> }];
 *   const matches = matchRoutes(routes, { pathname: '/users/123' });
 *   // matches[0].params.id === '123'
 * }
 * ```
 *
 * @public
 */
export function matchRoutes<T extends RouteObject>(
  routes: T[],
  location: { pathname: string },
): RouteMatch<T>[] | null {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const routerApi = useApi(routerApiRef);
  return routerApi.matchRoutes(routes, location);
}

/**
 * Generate a path from a route pattern and params.
 *
 * @remarks
 * Must be called within a React component or hook context.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const path = generatePath('/users/:id', { id: '123' });
 *   // path === '/users/123'
 *   return <Link to={path}>User</Link>;
 * }
 * ```
 *
 * @public
 */
export function generatePath(
  pattern: string,
  params?: Record<string, string | undefined>,
): string {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const routerApi = useApi(routerApiRef);
  return routerApi.generatePath(pattern, params);
}

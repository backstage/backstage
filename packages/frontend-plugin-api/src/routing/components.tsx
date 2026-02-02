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

import {
  FC,
  Fragment,
  ReactElement,
  ReactNode,
  Children,
  isValidElement,
} from 'react';
import { useApi, routerApiRef } from '../apis';
import type {
  LinkProps,
  NavLinkProps,
  RouteProps,
  Location,
  RouteObject,
  NavigateProps,
} from './routerTypes';

/**
 * Navigation link component.
 * Renders an anchor tag that navigates on click without a full page reload.
 *
 * @example
 * ```tsx
 * <Link to="/about">About</Link>
 * <Link to="/login" replace>Login</Link>
 * ```
 *
 * @public
 */
export const Link: FC<LinkProps> = props => {
  const { Link: LinkComponent } = useApi(routerApiRef);
  return <LinkComponent {...props} />;
};

/**
 * Navigation link with active state styling.
 * Automatically applies active styles when the link matches the current URL.
 *
 * @example
 * ```tsx
 * <NavLink
 *   to="/dashboard"
 *   className={({ isActive }) => isActive ? 'active' : ''}
 * >
 *   Dashboard
 * </NavLink>
 * ```
 *
 * @public
 */
export const NavLink: FC<NavLinkProps> = props => {
  const { NavLink: NavLinkComponent } = useApi(routerApiRef);
  return <NavLinkComponent {...props} />;
};

/**
 * Outlet for rendering nested routes.
 * Place this where you want child route content to appear.
 *
 * @example
 * ```tsx
 * function Layout() {
 *   return (
 *     <div>
 *       <nav>...</nav>
 *       <Outlet />
 *     </div>
 *   );
 * }
 * ```
 *
 * @public
 */
export const Outlet: FC<{ context?: unknown }> = props => {
  const { Outlet: OutletComponent } = useApi(routerApiRef);
  return <OutletComponent {...props} />;
};

/**
 * Route definition component.
 * Defines a route that renders its element when the path matches.
 *
 * @remarks
 * This is a marker component - it doesn't render anything on its own.
 * It must be used as a child of the Routes component.
 *
 * @example
 * ```tsx
 * <Routes>
 *   <Route path="/" element={<Home />} />
 *   <Route path="/about" element={<About />} />
 * </Routes>
 * ```
 *
 * @public
 */
export const Route: FC<RouteProps> = (_props): ReactElement | null => {
  // This component doesn't render anything - it's a marker that Routes parses.
  // If rendered directly (not inside Routes), it will throw a helpful error.
  throw new Error(
    '<Route> must be used as a child of <Routes>. ' +
      'It cannot be rendered outside of a <Routes> component.',
  );
};

/**
 * Props for the Routes component.
 * @public
 */
export interface RoutesProps {
  /** Child Route elements */
  children?: ReactNode;
  /** Override the location to match against (can be a Location object or path string) */
  location?: Partial<Location> | string;
}

/**
 * Pattern to detect multi-segment splat paths (e.g., "dashboard/*" but not just "*")
 * These paths have different relative link behavior in react-router v7.
 * @see https://reactrouter.com/upgrading/v6#v7_relativesplatpath
 */
const MULTI_SEGMENT_SPLAT_PATTERN = /^.+\/\*$/;

/**
 * Warns about multi-segment splat paths that may have breaking changes in react-router v7.
 * @internal
 */
function warnAboutMultiSegmentSplatPath(path: string | undefined): void {
  if (
    process.env.NODE_ENV !== 'production' &&
    path &&
    MULTI_SEGMENT_SPLAT_PATTERN.test(path)
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Backstage] Route path "${path}" uses a multi-segment splat pattern. ` +
        `In react-router v7, relative links inside this route will resolve differently. ` +
        `Consider splitting into a parent route with the path and a child route with just "*". ` +
        `See: https://reactrouter.com/upgrading/v6#v7_relativesplatpath`,
    );
  }
}

/**
 * Creates route objects from JSX Route children.
 * Useful for programmatically working with route definitions.
 *
 * @example
 * ```tsx
 * const routes = createRoutesFromChildren(
 *   <>
 *     <Route path="/" element={<Home />} />
 *     <Route path="/about" element={<About />} />
 *   </>
 * );
 * ```
 *
 * @public
 */
export function createRoutesFromChildren(
  children: ReactNode,
  parentPath: number[] = [],
): RouteObject[] {
  const routes: RouteObject[] = [];

  Children.forEach(children, (element, index) => {
    if (!isValidElement(element)) {
      // Ignore non-elements (null, undefined, strings, etc.)
      return;
    }

    const treePath = [...parentPath, index];

    // Handle Fragment - flatten its children
    if (element.type === Fragment) {
      routes.push(
        ...createRoutesFromChildren(element.props.children, treePath),
      );
      return;
    }

    // Accept our Route component or any component with Route-like props
    const props = element.props as RouteProps;

    // Warn about multi-segment splat paths (react-router v7 breaking change)
    warnAboutMultiSegmentSplatPath(props.path);

    const route: RouteObject = {
      id: props.id ?? treePath.join('-'),
      caseSensitive: props.caseSensitive,
      path: props.path,
      index: props.index,
      element: props.element,
      Component: props.Component,
      errorElement: props.errorElement,
      ErrorBoundary: props.ErrorBoundary,
      handle: props.handle,
    };

    // Recursively process nested routes
    if (props.children) {
      route.children = createRoutesFromChildren(props.children, treePath);
    }

    routes.push(route);
  });

  return routes;
}

/**
 * Routes container component.
 * Renders the first child Route that matches the current location.
 *
 * @remarks
 * This implementation works with wrapper Route components by parsing
 * children's props directly instead of checking component types.
 *
 * @example
 * ```tsx
 * <Routes>
 *   <Route path="/" element={<Home />} />
 *   <Route path="/users/*">
 *     <Route index element={<UserList />} />
 *     <Route path=":id" element={<UserDetail />} />
 *   </Route>
 * </Routes>
 * ```
 *
 * @public
 */
export const Routes: FC<RoutesProps> = ({ children, location }) => {
  const { useRoutes } = useApi(routerApiRef);

  const routes = createRoutesFromChildren(children);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRoutes(routes, location) ?? null;
};

/**
 * Navigate component for declarative redirects.
 * Renders nothing and navigates to the specified destination.
 *
 * @example
 * ```tsx
 * // Redirect to another page
 * <Navigate to="/home" />
 *
 * // Replace current history entry
 * <Navigate to="/login" replace />
 *
 * // Navigate with state
 * <Navigate to="/dashboard" state={{ from: 'welcome' }} />
 * ```
 *
 * @public
 */
export const Navigate: FC<NavigateProps> = props => {
  const { Navigate: NavigateComponent } = useApi(routerApiRef);
  return <NavigateComponent {...props} />;
};

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

import { ReactNode, useMemo } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
  useResolvedPath as useResolvedPathRR,
  useOutlet,
  useRoutes,
  useHref,
  matchRoutes,
  generatePath,
  resolvePath,
} from 'react-router-dom';
import {
  RoutingContextType,
  useApi,
  configApiRef,
} from '@backstage/frontend-plugin-api';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';
import { getBasePath } from './getBasePath';
import { RouterAdapter } from './RouterAdapter';

/**
 * The versioned routing context, stored as a global singleton via version-bridge.
 * This ensures cross-package compatibility even when different versions are loaded.
 */
const RoutingVersionedContext = createVersionedContext<{
  1: RoutingContextType;
}>('frontend-routing-context');

/**
 * Adapts the React Router v6 context to the Backstage RoutingContext.
 *
 * This provider exposes lazy hooks (useLocation, useParams, useNavigate) rather than
 * reactive values, which means consumers only rerender when they actually call these hooks.
 * Static values like Route, Link, Outlet never cause rerenders.
 *
 * @public
 */
export const ReactRouter6Provider = ({ children }: { children: ReactNode }) => {
  // Create the context value once - no reactive hooks called at provider level
  const value: RoutingContextType = useMemo(
    () => ({
      // Static components - never cause rerenders
      Routes,
      Route,
      Link: Link as any,
      NavLink: NavLink as any,
      Outlet,

      // Static functions - never cause rerenders
      matchRoutes: (routes, loc) => matchRoutes(routes, loc),
      generatePath: (path: string, p?: Record<string, string | undefined>) =>
        generatePath(path, p),
      resolvePath: (to: string, fromPathname?: string) =>
        resolvePath(to, fromPathname),

      // Lazy hooks - only cause rerenders when called by consumers
      useLocation: () => {
        const loc = useLocation();
        return { pathname: loc.pathname, search: loc.search, hash: loc.hash };
      },
      useParams: () => useParams() as Record<string, string | undefined>,
      useNavigate: () => {
        const nav = useNavigate();
        return (to: string) => nav(to);
      },
      useHref: () => useHref,
      useSearchParams: () => useSearchParams(),
      useResolvedPath: () => useResolvedPathRR,
      useOutlet: () => useOutlet,
      useRoutes: () => useRoutes,
    }),
    [],
  );

  return (
    <RoutingVersionedContext.Provider
      value={createVersionedValueMap({ 1: value })}
    >
      {children}
    </RoutingVersionedContext.Provider>
  );
};

/**
 * A Backstage router that uses React Router v6 to handle navigation and routing.
 *
 * @public
 */
export const ReactRouter6Router = ({ children }: { children: ReactNode }) => {
  const configApi = useApi(configApiRef);
  const basePath = getBasePath(configApi);

  return (
    <BrowserRouter basename={basePath}>
      <ReactRouter6Provider>{children}</ReactRouter6Provider>
    </BrowserRouter>
  );
};

/**
 * Internal router component that accepts basePath as a prop.
 * Used by the RouterAdapter interface.
 */
const ReactRouter6RouterWithBasePath = ({
  children,
  basePath,
}: {
  children: ReactNode;
  basePath: string;
}) => {
  return (
    <BrowserRouter basename={basePath}>
      <ReactRouter6Provider>{children}</ReactRouter6Provider>
    </BrowserRouter>
  );
};

/**
 * A RouterAdapter implementation for React Router v6.
 *
 * This adapter provides the standard React Router v6 implementation
 * for the Backstage routing system.
 *
 * @public
 */
export const ReactRouter6Adapter: RouterAdapter = {
  Provider: ReactRouter6Provider,
  Router: ReactRouter6RouterWithBasePath,
  matchRoutes: (routes, loc) => matchRoutes(routes, loc),
  generatePath: (path: string, p?: Record<string, string | undefined>) =>
    generatePath(path, p),
};

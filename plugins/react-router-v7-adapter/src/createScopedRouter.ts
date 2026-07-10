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

import type { ComponentType, ReactNode } from 'react';
import type { RoutingContract } from '@backstage/frontend-plugin-api';
import { createScopedRouterWithBindings } from './createScopedRouterWithBindings';
import type {
  ReactRouterAdapterBindings,
  ScopedRouterWithBindingsResult as CommonScopedRouterResult,
} from './types';
import {
  UNSAFE_LocationContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
  NavigationType,
  matchPath,
  Route,
  Routes,
  useLocation as useRRLocation,
  useNavigate as useRRNavigate,
  useParams as useRRParams,
  useSearchParams as useRRSearchParams,
} from 'react-router';
import type { Location, NavigateFunction } from 'react-router';

/** Options for {@link createScopedRouter}.
 *
 * @public
 */
export interface CreateScopedRouterOptions {
  /**
   * Registered page path pattern (e.g. `/catalog` or
   * `/catalog/:namespace/:kind/:name`). Used to populate React Router
   * `useParams` via a splat match of `${routePattern}/*`.
   */
  routePattern?: string;
  /**
   * App deploy basename (e.g. `/backstage`). Prefixed onto `createHref`
   * results so Link `href`s work under subpath deploys.
   */
  appBasename?: string;
  /**
   * History stack navigation (back/forward). Prefer omitting this and using
   * RoutingContract.go on the contract. When provided, overrides the
   * contract. When neither is available, `go` is a no-op and a development
   * warning is logged — never falls back to `window.history.go`.
   */
  go?: (delta: number) => void;
}

/**
 * Result of {@link createScopedRouter}.
 *
 * @public
 */
export interface ScopedRouterResult {
  /** React component that provides React Router v7 context for its children. */
  Router: ComponentType<{ children: ReactNode }>;
  /** Bound `useLocation` from `react-router`. */
  useLocation: () => Location;
  /** Bound `useNavigate` from `react-router`. */
  useNavigate: () => NavigateFunction;
  /** Bound `useParams` from `react-router`. */
  useParams: <T extends Record<string, string | undefined>>() => T;
  /** Bound `useSearchParams` from `react-router`. */
  useSearchParams: (
    ...args: Parameters<typeof useRRSearchParams>
  ) => ReturnType<typeof useRRSearchParams>;
  /** Unsubscribes from the contract's location$ observable. */
  dispose: () => void;
}

const v7Bindings: ReactRouterAdapterBindings = {
  NavigationType,
  matchPath: matchPath as ReactRouterAdapterBindings['matchPath'],
  UNSAFE_NavigationContext:
    UNSAFE_NavigationContext as ReactRouterAdapterBindings['UNSAFE_NavigationContext'],
  UNSAFE_LocationContext:
    UNSAFE_LocationContext as ReactRouterAdapterBindings['UNSAFE_LocationContext'],
  UNSAFE_RouteContext:
    UNSAFE_RouteContext as ReactRouterAdapterBindings['UNSAFE_RouteContext'],
  useLocation: useRRLocation as ReactRouterAdapterBindings['useLocation'],
  useNavigate: useRRNavigate as ReactRouterAdapterBindings['useNavigate'],
  useParams: useRRParams as ReactRouterAdapterBindings['useParams'],
  useSearchParams: useRRSearchParams,
  Route: Route as ReactRouterAdapterBindings['Route'],
  Routes,
};

/**
 * Creates a React Router v7 context adapter bound to a RoutingContract.
 *
 * Injects `UNSAFE_*` contexts directly (never nests `<Router>` / writes
 * `window.history` via push/replace). Navigation is delegated to
 * `contract.navigate`; back/forward uses `contract.go`, or the `go` option
 * when provided as an override.
 *
 * Location exposed to React Router is **app-absolute** (`basePath` + scoped
 * pathname) so relative Links and in-plugin `Routes` resolve the same way they
 * did under a root router. `contract.navigate` still receives paths scoped to
 * `basePath`.
 *
 * @public
 */
export function createScopedRouter(
  contract: RoutingContract,
  options?: CreateScopedRouterOptions,
): ScopedRouterResult {
  const result: CommonScopedRouterResult = createScopedRouterWithBindings(
    v7Bindings,
    contract,
    {
      ...options,
      // React Router v7 NavigationContextObject requires future: {} and
      // useTransitions (boolean | undefined).
      navigationContextExtras: {
        future: {},
        useTransitions: undefined,
      },
    },
  );

  return {
    Router: result.Router,
    useLocation: result.useLocation as () => Location,
    useNavigate: result.useNavigate as () => NavigateFunction,
    useParams: result.useParams as <
      T extends Record<string, string | undefined>,
    >() => T,
    useSearchParams:
      result.useSearchParams as ScopedRouterResult['useSearchParams'],
    dispose: result.dispose,
  };
}

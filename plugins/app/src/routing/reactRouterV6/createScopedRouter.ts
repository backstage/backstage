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
import type { AppHistoryApi } from '@backstage/frontend-plugin-api';
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
  useLocation as useRRLocation,
  useNavigate as useRRNavigate,
  useParams as useRRParams,
  useSearchParams as useRRSearchParams,
} from 'react-router-dom';
import type { Location, NavigateFunction } from 'react-router-dom';

/** Options for {@link createScopedRouter}.
 *
 * @internal
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
   * History stack navigation (back/forward). When omitted, `go` is a no-op
   * and a development warning is logged — window.history.go is never used
   * as a fallback.
   */
  go?: (delta: number) => void;
}

/**
 * Result of {@link createScopedRouter}.
 *
 * @internal
 */
export interface ScopedRouterResult {
  /** React component that provides React Router v6 context for its children. */
  Router: ComponentType<{ children: ReactNode }>;
  /** Bound `useLocation` from `react-router-dom`. */
  useLocation: () => Location;
  /** Bound `useNavigate` from `react-router-dom`. */
  useNavigate: () => NavigateFunction;
  /** Bound `useParams` from `react-router-dom`. */
  useParams: <T extends Record<string, string | undefined>>() => T;
  /** Bound `useSearchParams` from `react-router-dom`. */
  useSearchParams: (
    ...args: Parameters<typeof useRRSearchParams>
  ) => ReturnType<typeof useRRSearchParams>;
  /** Unsubscribes from the app history's location$ observable. */
  dispose: () => void;
}

const v6Bindings: ReactRouterAdapterBindings = {
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
};

/**
 * Creates a React Router v6 context adapter projected from the framework's
 * {@link AppHistoryApi}.
 *
 * Injects `UNSAFE_*` contexts directly (never nests `<Router>` / writes
 * `window.history` via push/replace). Navigation is delegated to
 * `appHistory.navigate`; back/forward uses the `go` option when provided.
 *
 * @internal
 */
export function createScopedRouter(
  appHistory: AppHistoryApi,
  basePath: string,
  options?: CreateScopedRouterOptions,
): ScopedRouterResult {
  const result: CommonScopedRouterResult = createScopedRouterWithBindings(
    v6Bindings,
    appHistory,
    {
      basePath,
      ...options,
      navigationContextExtras: {
        future: {
          v7_relativeSplatPath: false,
        },
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

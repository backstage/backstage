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

import type { ComponentType, Context, ReactNode } from 'react';

/**
 * Minimal location shape shared by React Router v6 and v7.
 *
 * @internal
 */
export interface AdapterLocation {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
}

/**
 * Destination accepted by React Router navigators.
 *
 * @internal
 */
export type AdapterTo =
  | string
  | Partial<{ pathname: string; search: string; hash: string }>;

/**
 * Path-match result used to seed RouteContext.
 *
 * @internal
 */
export interface AdapterPathMatch {
  pathname: string;
  pathnameBase: string;
  pattern: { path: string };
  params: Record<string, string | undefined>;
}

/**
 * React Router APIs injected into {@link createScopedRouterWithBindings} so
 * that helper never has to hard-code a specific `react-router` version.
 *
 * @internal
 */
export interface ReactRouterAdapterBindings {
  NavigationType: { Pop: unknown };
  matchPath: (
    pattern: { path: string; end?: boolean },
    pathname: string,
  ) => AdapterPathMatch | null;
  UNSAFE_NavigationContext: Context<unknown>;
  UNSAFE_LocationContext: Context<unknown>;
  UNSAFE_RouteContext: Context<unknown>;
  useLocation: () => AdapterLocation;
  useNavigate: () => (...args: any[]) => any;
  useParams: () => Record<string, string | undefined>;
  useSearchParams: (...args: any[]) => any;
}

/**
 * Version-specific fields merged into NavigationContext (v6 future flags vs
 * v7 `future` / `useTransitions`).
 *
 * @internal
 */
export type NavigationContextExtras = Record<string, unknown>;

/**
 * Options for {@link createScopedRouterWithBindings}.
 *
 * @internal
 */
export interface CreateScopedRouterWithBindingsOptions {
  /**
   * Concrete app-absolute URL prefix this page is mounted at (e.g.
   * `/catalog` or `/catalog/default/component/foo`).
   */
  basePath: string;
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
  /**
   * Extra NavigationContext fields that differ between React Router major
   * versions (e.g. v6 `future.v7_relativeSplatPath` vs v7 `useTransitions`).
   */
  navigationContextExtras?: NavigationContextExtras;
}

/**
 * Result of {@link createScopedRouterWithBindings}.
 *
 * @internal
 */
export interface ScopedRouterWithBindingsResult {
  /** React component that provides React Router context for its children. */
  Router: ComponentType<{ children: ReactNode }>;
  /** Bound `useLocation` from the injected bindings. */
  useLocation: () => AdapterLocation;
  /** Bound `useNavigate` from the injected bindings. */
  useNavigate: () => (...args: any[]) => any;
  /** Bound `useParams` from the injected bindings. */
  useParams: <T extends Record<string, string | undefined>>() => T;
  /** Bound `useSearchParams` from the injected bindings. */
  useSearchParams: (...args: any[]) => any;
  /** Unsubscribes from the app history's location$ observable. */
  dispose: () => void;
}

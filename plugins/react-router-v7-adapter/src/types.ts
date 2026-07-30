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

import type {
  ComponentType,
  Context,
  MutableRefObject,
  ReactNode,
} from 'react';

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
 * React Router APIs injected by each versioned adapter so this package never
 * depends on `react-router` / `react-router-dom` peers.
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
   * Live ref to the page's current concrete `basePath` (e.g. `/catalog` or
   * `/catalog/default/component/foo`). Read on every render rather than
   * captured at creation, so navigating between concrete prefixes under the
   * same `routePattern` (e.g. entity A → entity B) doesn't require
   * recreating the router / losing in-page component state.
   */
  basePathRef: MutableRefObject<string>;
  /**
   * Registered page route pattern (e.g. `/catalog` or
   * `/catalog/:namespace/:kind/:name`). Used to populate React Router
   * `useParams`.
   */
  routePattern: string;
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
}

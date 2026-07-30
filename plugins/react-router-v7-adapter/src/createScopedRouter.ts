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

import type { ComponentType, MutableRefObject, ReactNode } from 'react';
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
} from 'react-router';
import type { Location, NavigateFunction } from 'react-router';

/** Options for {@link createScopedRouter}.
 *
 * @internal
 */
export interface CreateScopedRouterOptions {
  /** Live ref to the page's current concrete `basePath`. */
  basePathRef: MutableRefObject<string>;
  /**
   * Registered page path pattern (e.g. `/catalog` or
   * `/catalog/:namespace/:kind/:name`). Used to populate React Router
   * `useParams`.
   */
  routePattern: string;
}

/**
 * Result of {@link createScopedRouter}.
 *
 * @internal
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
};

/**
 * Creates a React Router v7 context adapter bound to the framework's
 * {@link AppHistoryApi}.
 *
 * Injects `UNSAFE_*` contexts directly (never nests `<Router>` / writes
 * `window.history` via push/replace/go). Navigation is delegated to
 * `appHistory.navigate`.
 *
 * @internal
 */
export function createScopedRouter(
  appHistory: AppHistoryApi,
  options: CreateScopedRouterOptions,
): ScopedRouterResult {
  const result: CommonScopedRouterResult = createScopedRouterWithBindings(
    v7Bindings,
    appHistory,
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
  };
}

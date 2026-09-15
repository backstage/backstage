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

import type { AppHistoryApi } from '@backstage/frontend-plugin-api';
import {
  createAppHistoryRouter,
  type AppHistoryRouterResult,
  type ReactRouterAdapterBindings,
} from '@internal/frontend';
import {
  UNSAFE_LocationContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
  NavigationType,
  matchPath,
} from 'react-router';

/** Options for {@link createScopedRouter}.
 *
 * @internal
 */
export interface CreateScopedRouterOptions {
  /**
   * Registered page route pattern (e.g. `/catalog` or
   * `/catalog/:namespace/:kind/:name`). The page's route match — params,
   * splat tail and the base that relative targets resolve against — is
   * derived from this pattern and the live app location.
   */
  routePattern: string;
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
): AppHistoryRouterResult {
  return createAppHistoryRouter(v7Bindings, appHistory, {
    ...options,
    // React Router v7 NavigationContextObject requires future: {} and
    // useTransitions (boolean | undefined). v7 has no relative-splat flag:
    // relative targets always resolve against the leaf match's full
    // pathname, which is why the projected match has to carry the real
    // splat tail rather than just the page's prefix.
    navigationContextExtras: {
      future: {},
      useTransitions: undefined,
    },
  });
}

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

import { useMemo, type ReactNode } from 'react';
import {
  NavigationType,
  UNSAFE_LocationContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
  matchPath,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import type { AppHistoryApi } from '@backstage/frontend-plugin-api';
import {
  createAppHistoryRouter,
  type ReactRouterAdapterBindings,
} from '@internal/frontend';

/**
 * Props for {@link RootHistoryRouter}.
 *
 * @internal
 */
export interface RootHistoryRouterProps {
  history: AppHistoryApi;
  children: ReactNode;
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
  useLocation: useLocation as ReactRouterAdapterBindings['useLocation'],
  useNavigate: useNavigate as ReactRouterAdapterBindings['useNavigate'],
  useParams: useParams as ReactRouterAdapterBindings['useParams'],
  useSearchParams,
};

/**
 * Provides a root React Router v6 context (Navigation / Location / Route)
 * projected from the framework's {@link AppHistoryApi}, without nesting a
 * `<Router>` or writing to `window.history` itself — `AppHistoryApi` remains
 * the sole history authority.
 *
 * This is the same projection the page router adapters use, at app root scope
 * instead of page scope: app chrome is not mounted under any page route, so
 * no route pattern is supplied and the published route context is empty.
 *
 * Shared by app chrome (`plugins/app`) and test apps (`frontend-test-utils`)
 * that still need a root React Router context for legacy chrome / old
 * frontend system compatibility (`useResolvedPath`, relative `Link`
 * targets, etc.), without depending on a page-router adapter package.
 *
 * @internal
 */
export function RootHistoryRouter(props: RootHistoryRouterProps) {
  const { history, children } = props;

  // Only ever recreated for a genuinely different app history: a new element
  // type here would unmount and remount all of the app chrome below it.
  const { Router } = useMemo(
    () =>
      createAppHistoryRouter(v6Bindings, history, {
        name: 'RootHistoryRouter',
        // No `routePattern`: app chrome is not mounted under a page route, so
        // there is no match to project and relative targets resolve from the
        // app root.
        //
        // React Router v6 NavigationContextObject requires the future flags,
        // and this projection keeps the v6 default: relative targets resolve
        // against the leaf match's pathnameBase rather than its splat tail.
        navigationContextExtras: {
          future: {
            v7_relativeSplatPath: false,
          },
        },
      }),
    [history],
  );

  return <Router>{children}</Router>;
}

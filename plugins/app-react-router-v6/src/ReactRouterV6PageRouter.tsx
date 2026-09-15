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
import { appHistoryApiRef, useApiHolder } from '@backstage/frontend-plugin-api';
import {
  createAppHistoryRouter,
  usePageMount,
  type ReactRouterAdapterBindings,
} from '@internal/frontend';
import {
  UNSAFE_LocationContext,
  UNSAFE_NavigationContext,
  UNSAFE_RouteContext,
  NavigationType,
  matchPath,
} from 'react-router-dom';

const v6Bindings: ReactRouterAdapterBindings = {
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
 * React Router v6 page adapter. Injects library context projected from the
 * framework's `AppHistoryApi` and never writes `window.history` via
 * push/replace/go.
 *
 * `children` are opaque React Router content (for example `<Routes>` /
 * `<Route>` trees composed by the page itself, or the sub-page the framework
 * routed to) and are rendered as-is. This adapter builds no routes of its own:
 * which sub-page of a page is showing is decided by the framework's own route
 * matching, one level above.
 *
 * Programmatic back and forward (`navigate(-1)`) traverse the app-owned
 * browser history.
 *
 * Declare it by rendering it inside the lazily loaded page or sub-page component that
 * should get the context:
 *
 * ```tsx
 * // In the lazily loaded page component module:
 * export function CatalogPage() {
 *   return (
 *     <ReactRouterV6PageRouter>
 *       {routes}
 *     </ReactRouterV6PageRouter>
 *   );
 * }
 * ```
 *
 * In a sub-page's component it scopes itself to that sub-page rather than to
 * the page above it, because the sub-page's own mount is what is in context
 * there. Adapters nest rather than replace one another, so a v6 sub-page works
 * under a page rendered by another routing library, and the reverse.
 *
 * Scoping needs two things: a page mount, saying which part of the URL belongs
 * to the page, and a registered `AppHistoryApi` to project a location from.
 * With either missing this adapter renders `children` untouched and demands
 * nothing of the surrounding app — no API provider, no framework context. That
 * passthrough is what lets one component wrap itself in the adapter and still
 * ship for both frontend systems: under the old frontend system there is no
 * page mount and no app history, and the wrap has to be invisible rather than
 * a crash. The same holds in a plugin's own `render()` unit tests.
 *
 * @public
 */
export function ReactRouterV6PageRouter(props: { children?: ReactNode }) {
  const { children } = props;
  // Read through the holder rather than `useApi`, which throws when no app
  // history is registered — that throw would happen before the passthrough
  // below could be reached, in exactly the apps that need it.
  const appHistory = useApiHolder().get(appHistoryApiRef);
  const routePattern = usePageMount()?.routePattern;

  // Only ever recreated for a genuinely different router: a new element type
  // here would unmount and remount the whole page subtree, throwing away page
  // state, scroll position and in-flight requests.
  const scopedRouter = useMemo(
    () =>
      routePattern && appHistory
        ? createAppHistoryRouter(v6Bindings, appHistory, {
            routePattern,
            // Keep the v6 default: relative targets use the leaf match's
            // pathnameBase rather than its splat tail.
            navigationContextExtras: {
              future: { v7_relativeSplatPath: false },
            },
          })
        : undefined,
    [appHistory, routePattern],
  );

  if (!scopedRouter) {
    return <>{children}</>;
  }

  return <scopedRouter.Router>{children}</scopedRouter.Router>;
}

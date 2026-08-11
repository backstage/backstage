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
import { useApi, appHistoryApiRef } from '@backstage/frontend-plugin-api';
import { usePageMount } from '@internal/frontend';
import { createScopedRouter } from './createScopedRouter';

/**
 * React Router v7 page adapter. Injects library context projected from the
 * framework's `AppHistoryApi` and never writes `window.history` via
 * push/replace/go.
 *
 * `children` are rendered as opaque content inside that context — an existing
 * React Router `<Routes>` tree composed by the page itself keeps working
 * (relative Links, nested `<Routes>`, `useParams`, and so on), as does the
 * sub-page the framework routed to. This adapter builds no routes of its own:
 * which sub-page of a page is showing is decided by the framework's own route
 * matching, one level above.
 *
 * Programmatic back and forward (`navigate(-1)`) traverse the app-owned
 * browser history.
 *
 * Attach via PageRouterBlueprint to a page's optional `router` input to
 * override the app-plugin default, or to a sub-page's to give that sub-page's
 * content a context of its own, scoped to the sub-page rather than to the page
 * above it.
 *
 * @public
 */
export function ReactRouterV7PageRouter(props: { children?: ReactNode }) {
  const { children } = props;
  const appHistory = useApi(appHistoryApiRef);
  const routePattern = usePageMount()?.routePattern;

  // Only ever recreated for a genuinely different router: a new element type
  // here would unmount and remount the whole page subtree, throwing away page
  // state, scroll position and in-flight requests.
  const scopedRouter = useMemo(
    () =>
      routePattern
        ? createScopedRouter(appHistory, { routePattern })
        : undefined,
    [appHistory, routePattern],
  );

  if (!scopedRouter) {
    return <>{children}</>;
  }

  return <scopedRouter.Router>{children}</scopedRouter.Router>;
}

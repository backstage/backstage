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
import { appHistoryApiRef, useApi } from '@backstage/frontend-plugin-api';
import { createScopedRouter } from './createScopedRouter';

/**
 * Default React Router v6 page adapter. Injects library context projected
 * from the framework's app history and never writes `window.history` via
 * push/replace.
 *
 * `children` are opaque React Router content (e.g. `<Routes>` / `<Route>`
 * trees composed by the page itself, or the sub-page the framework routed to)
 * and are rendered as-is. This adapter builds no routes of its own: which
 * sub-page of a page is showing is decided by the framework's own route
 * matching, one level above.
 *
 * @internal
 */
export function ReactRouterV6PageRouter(props: {
  /**
   * Concrete app-absolute URL prefix this page is mounted at. Not read by
   * this adapter: the page's route match is derived from `routePattern` and
   * the live location, which keeps the two in step and keeps the router
   * mount-stable while the concrete prefix changes (entity A → entity B).
   */
  basePath: string;
  /** Registered route pattern this page is mounted at. */
  routePattern: string;
  children?: ReactNode;
}) {
  const { routePattern, children } = props;
  const appHistory = useApi(appHistoryApiRef);

  // Only ever recreated for a genuinely different router: a new element type
  // here would unmount and remount the whole page subtree, throwing away page
  // state, scroll position and in-flight requests.
  const scopedRouter = useMemo(
    () => createScopedRouter(appHistory, { routePattern }),
    [appHistory, routePattern],
  );

  return <scopedRouter.Router>{children}</scopedRouter.Router>;
}

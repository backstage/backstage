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
  useApi,
  appHistoryApiRef,
  type PageRouterSubPage,
} from '@backstage/frontend-plugin-api';
import { Navigate, Route, Routes } from 'react-router-dom';
import { createScopedRouter } from './createScopedRouter';

/**
 * React Router v7 page adapter. Injects library context projected from the
 * framework's `AppHistoryApi` and never writes `window.history` via
 * push/replace/go.
 *
 * Sub-pages arrive as data and are compiled here into a React Router
 * `<Routes>` tree, applying this library's own prefix convention (a `/*`
 * splat, so a sub-page can nest further routes of its own). `children` are
 * rendered as opaque content inside the same context — an existing React
 * Router `<Routes>` tree composed by the page itself keeps working (relative
 * Links, nested `<Routes>`, `useParams`, and so on).
 *
 * Programmatic back/forward (`navigate(-1)`) is not supported — there is a
 * single, real browser history; use the browser's own back/forward.
 *
 * Attach via PageRouterBlueprint to a page's optional `router` input to
 * override the app-plugin default.
 *
 * @public
 */
export function ReactRouterV7PageRouter(props: {
  /**
   * Concrete app-absolute URL prefix this page is mounted at. Not read by
   * this adapter: the page's route match is derived from `routePattern` and
   * the live location, which keeps the two in step and keeps the router
   * mount-stable while the concrete prefix changes (entity A → entity B).
   */
  basePath: string;
  /** Registered route pattern this page is mounted at. */
  routePattern: string;
  /** The page's sub-pages, for this adapter to route between. */
  subPages?: readonly PageRouterSubPage[];
  /** Sub-page path the page root redirects to. */
  indexPath?: string;
  children?: ReactNode;
}) {
  const { routePattern, subPages, indexPath, children } = props;
  const appHistory = useApi(appHistoryApiRef);

  // Only ever recreated for a genuinely different router: a new element type
  // here would unmount and remount the whole page subtree, throwing away page
  // state, scroll position and in-flight requests.
  const scopedRouter = useMemo(
    () => createScopedRouter(appHistory, { routePattern }),
    [appHistory, routePattern],
  );

  return (
    <scopedRouter.Router>
      {subPages?.length ? (
        <Routes>
          {indexPath && (
            <Route index element={<Navigate to={indexPath} replace />} />
          )}
          {subPages.map(subPage => (
            <Route
              key={subPage.path}
              path={`${subPage.path}/*`}
              element={subPage.element}
            />
          ))}
        </Routes>
      ) : (
        children
      )}
    </scopedRouter.Router>
  );
}

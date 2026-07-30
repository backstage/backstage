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

import { useMemo, useRef, type ReactNode } from 'react';
import { useApi, appHistoryApiRef } from '@backstage/frontend-plugin-api';
import { createScopedRouter } from './createScopedRouter';

/**
 * React Router v7 page adapter. Injects library context projected from the
 * framework's `AppHistoryApi` and never writes `window.history` via
 * push/replace/go.
 *
 * Renders `children` as opaque content inside that context — an existing
 * React Router `<Routes>` tree composed by the page itself keeps working
 * (relative Links, nested `<Routes>`, `useParams`, and so on).
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
  /** Concrete app-absolute URL prefix this page is mounted at. */
  basePath: string;
  /** Registered route pattern this page is mounted at. */
  routePattern: string;
  /** App deploy basename — unused; `AppHistoryApi.createHref` already applies it. */
  appBasename?: string;
  children: ReactNode;
}) {
  const { basePath, routePattern, children } = props;
  const appHistory = useApi(appHistoryApiRef);
  const basePathRef = useRef(basePath);
  basePathRef.current = basePath;

  const scopedRouter = useMemo(
    () => createScopedRouter(appHistory, { basePathRef, routePattern }),
    // basePathRef is a stable ref object; basePath changes flow through it
    // without recreating the router (and without losing in-page state).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appHistory, routePattern],
  );

  return <scopedRouter.Router>{children}</scopedRouter.Router>;
}

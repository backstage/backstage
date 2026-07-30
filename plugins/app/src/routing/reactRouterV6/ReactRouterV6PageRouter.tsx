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

import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { appHistoryApiRef, useApi } from '@backstage/frontend-plugin-api';
import {
  createScopedRouter,
  type ScopedRouterResult,
} from './createScopedRouter';

/**
 * Default React Router v6 page adapter. Injects library context projected
 * from the framework's app history and never writes `window.history` via
 * push/replace.
 *
 * `children` are opaque React Router content (e.g. existing `<Routes>` /
 * `<Route>` trees composed by the page). There is no library-agnostic route
 * descriptor path here — pages that need one must compile their own React
 * Router elements.
 *
 * @internal
 */
export function ReactRouterV6PageRouter(props: {
  basePath: string;
  routePattern: string;
  appBasename?: string;
  children: ReactNode;
}) {
  const { basePath, routePattern, appBasename, children } = props;
  const appHistory = useApi(appHistoryApiRef);
  const scopedRouterRef = useRef<ScopedRouterResult | null>(null);

  const scopedRouter = useMemo(() => {
    scopedRouterRef.current?.dispose();
    const created = createScopedRouter(appHistory, basePath, {
      routePattern,
      appBasename,
    });
    scopedRouterRef.current = created;
    return created;
  }, [appHistory, basePath, routePattern, appBasename]);

  useEffect(() => {
    return () => {
      scopedRouterRef.current?.dispose();
      scopedRouterRef.current = null;
    };
  }, [scopedRouter]);

  return <scopedRouter.Router>{children}</scopedRouter.Router>;
}

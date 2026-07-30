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

import {
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import {
  useApi,
  appHistoryApiRef,
  type AppHistoryApi,
} from '@backstage/frontend-plugin-api';
import type { RouterHistory } from '@tanstack/history';
import {
  RouterProvider,
  createRootRoute,
  createRouter,
  type AnyRouter,
} from '@tanstack/react-router';
import { createTanStackHistory } from './createTanStackHistory';

/**
 * Result of creating a TanStack scoped router for a page.
 *
 * @internal
 */
interface TanStackScopedRouter {
  router: AnyRouter;
  history: RouterHistory;
}

/**
 * Creates a TanStack router whose history projects the framework's
 * `AppHistoryApi`, scoped to `basePathRef`, with a single root route that
 * renders opaque page `children`. Never writes `window.history`.
 *
 * @internal
 */
function createTanStackScopedRouter(
  appHistory: AppHistoryApi,
  basePathRef: MutableRefObject<string>,
  childrenRef: MutableRefObject<ReactNode>,
): TanStackScopedRouter {
  const history = createTanStackHistory(appHistory, basePathRef);
  const routeTree = createRootRoute({
    component: () => <>{childrenRef.current}</>,
  });
  const router = createRouter({ routeTree, history });

  return { router, history };
}

/**
 * Host that creates a TanStack router for the page, disposes it on unmount /
 * `AppHistoryApi` identity change, and renders via TanStack `RouterProvider`.
 *
 * `basePath` changes (e.g. entity A → entity B under the same page) do not
 * recreate the router — they flow through the live `basePathRef` used by the
 * underlying history.
 *
 * @internal
 */
export function TanStackRouterHost(props: {
  basePath: string;
  children: ReactNode;
}) {
  const { basePath, children } = props;
  const appHistory = useApi(appHistoryApiRef);
  const basePathRef = useRef(basePath);
  basePathRef.current = basePath;
  const childrenRef = useRef<ReactNode>(children);
  childrenRef.current = children;
  const scopedRef = useRef<TanStackScopedRouter | null>(null);

  const scoped = useMemo(() => {
    scopedRef.current?.history.destroy();
    const created = createTanStackScopedRouter(
      appHistory,
      basePathRef,
      childrenRef,
    );
    scopedRef.current = created;
    return created;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appHistory]);

  useEffect(() => {
    return () => {
      scopedRef.current?.history.destroy();
      scopedRef.current = null;
    };
  }, [scoped]);

  return <RouterProvider router={scoped.router} />;
}

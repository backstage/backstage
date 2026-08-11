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
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import {
  useApi,
  appHistoryApiRef,
  type AppHistoryApi,
} from '@backstage/frontend-plugin-api';
import type { RouterHistory } from '@tanstack/history';
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  type AnyRoute,
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
 * What the host is currently asked to render, held outside the router.
 *
 * Going through context rather than through the route tree is what keeps the
 * router mount-stable: the content a page shows changes whenever the framework
 * routes to a different sub-page, and rebuilding the route tree for that would
 * throw away page state, scroll position and in-flight requests. Context
 * updates reach the route component through `RouterProvider` like any other
 * React context.
 */
const PageContentContext = createContext<ReactNode>(null);

/**
 * Renders the opaque page content supplied by the Backstage page blueprint.
 * Place this in a route component when using `createTanStackPageRouter` with
 * a plugin-owned route tree.
 *
 * @public
 */
export function TanStackPageContent() {
  return <>{useContext(PageContentContext)}</>;
}

interface CreateTanStackRouterOptions {
  history: RouterHistory;
}

type CreateTanStackRouter = (options: CreateTanStackRouterOptions) => AnyRouter;

/**
 * Creates a TanStack router whose history projects the framework's
 * `AppHistoryApi`, scoped to the page's route pattern. Never writes
 * `window.history`.
 *
 * The tree is two routes and never varies: the page's own root, and a `$`
 * splat sibling for everything below it. TanStack has no "match a prefix"
 * route, so the splat is this library's way of saying that the tail below the
 * mount belongs to the page — whatever the framework has routed into it.
 *
 * @internal
 */
function createTanStackScopedRouter(
  appHistory: AppHistoryApi,
  routePattern: string,
  createPageRouter: CreateTanStackRouter,
): TanStackScopedRouter {
  const history = createTanStackHistory(appHistory, { routePattern });
  return { router: createPageRouter({ history }), history };
}

/**
 * Creates the default catch-all route tree used by `TanStackPageRouter`.
 */
export function createDefaultTanStackRouter(
  options: CreateTanStackRouterOptions,
): AnyRouter {
  const rootRoute = createRootRoute({ component: Outlet }) as AnyRoute;
  const routeTree = rootRoute.addChildren(
    ['/', '/$'].map(
      path =>
        createRoute({
          getParentRoute: () => rootRoute,
          path,
          component: TanStackPageContent,
        } as any) as AnyRoute,
    ),
  );

  return createRouter({ routeTree, history: options.history });
}

/**
 * Host that creates a TanStack router for the page, disposes it on unmount /
 * `AppHistoryApi` identity change, and renders via TanStack `RouterProvider`.
 *
 * The concrete mount prefix changing (e.g. entity A → entity B under the same
 * page) does not recreate the router: the underlying history derives the
 * prefix from `routePattern` and the live location, so the page keeps its
 * in-page state across that navigation.
 *
 * @internal
 */
export function TanStackRouterHost(props: {
  routePattern: string;
  createRouter: CreateTanStackRouter;
  children?: ReactNode;
}) {
  const { routePattern, createRouter: createPageRouter, children } = props;
  const appHistory = useApi(appHistoryApiRef);

  const scoped = useMemo(
    () =>
      createTanStackScopedRouter(appHistory, routePattern, createPageRouter),
    [appHistory, routePattern, createPageRouter],
  );
  const lifecycleRef = useRef<{
    generation: number;
    scoped: TanStackScopedRouter | null;
  }>({ generation: 0, scoped: null });

  useEffect(() => {
    const generation = lifecycleRef.current.generation + 1;
    lifecycleRef.current = { generation, scoped };

    return () => {
      // React StrictMode replays effects without recreating the memoized
      // router. Defer disposal so the replayed setup can claim the same
      // instance; a genuinely replaced or unmounted instance is still
      // released immediately after the current commit finishes.
      queueMicrotask(() => {
        const current = lifecycleRef.current;
        if (current.scoped !== scoped || current.generation === generation) {
          scoped.history.destroy();
          if (current.scoped === scoped) {
            lifecycleRef.current = {
              generation: current.generation,
              scoped: null,
            };
          }
        }
      });
    };
  }, [scoped]);

  return (
    <PageContentContext.Provider value={children}>
      <RouterProvider router={scoped.router} />
    </PageContentContext.Provider>
  );
}

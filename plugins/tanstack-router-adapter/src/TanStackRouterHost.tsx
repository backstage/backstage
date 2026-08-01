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
  type PageRouterSubPage,
} from '@backstage/frontend-plugin-api';
import type { RouterHistory } from '@tanstack/history';
import {
  Navigate,
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

/** Live view of what the host is currently asked to render. */
interface PageContentRefs {
  children: MutableRefObject<ReactNode>;
  subPages: MutableRefObject<readonly PageRouterSubPage[]>;
  indexPath: MutableRefObject<string | undefined>;
}

/** TanStack route paths are absolute within the page's scoped history. */
function toScopedRoutePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Builds the route tree for a page's sub-pages.
 *
 * The framework hands over author-written paths, so this is where TanStack's
 * own conventions get applied: each sub-page gets an exact route plus a
 * sibling `$` splat route, which together are this library's equivalent of
 * React Router's `path/*`.
 */
function createSubPageRoutes(
  rootRoute: AnyRoute,
  content: PageContentRefs,
): AnyRoute[] {
  const routes: AnyRoute[] = [];
  const indexPath = content.indexPath.current;

  if (indexPath) {
    routes.push(
      createRoute({
        getParentRoute: () => rootRoute,
        path: '/',
        component: () => (
          <Navigate to={toScopedRoutePath(indexPath) as never} replace />
        ),
      } as any) as AnyRoute,
    );
  }

  content.subPages.current.forEach((subPage, index) => {
    // Read through the ref so a re-rendered sub-page element is picked up
    // without rebuilding the router.
    const component = () => <>{content.subPages.current[index]?.element}</>;
    const path = toScopedRoutePath(subPage.path);
    for (const routePath of [path, `${path}/$`]) {
      routes.push(
        createRoute({
          getParentRoute: () => rootRoute,
          path: routePath,
          component,
        } as any) as AnyRoute,
      );
    }
  });

  return routes;
}

/**
 * Creates a TanStack router whose history projects the framework's
 * `AppHistoryApi`, scoped to the page's route pattern. Sub-pages become real
 * TanStack routes; a page without sub-pages renders its opaque children under
 * a single root route. Never writes `window.history`.
 *
 * @internal
 */
function createTanStackScopedRouter(
  appHistory: AppHistoryApi,
  routePattern: string,
  content: PageContentRefs,
): TanStackScopedRouter {
  const history = createTanStackHistory(appHistory, { routePattern });

  if (content.subPages.current.length === 0) {
    const routeTree = createRootRoute({
      component: () => <>{content.children.current}</>,
    });
    return { router: createRouter({ routeTree, history }), history };
  }

  const rootRoute = createRootRoute({ component: Outlet }) as AnyRoute;
  const routeTree = rootRoute.addChildren(
    createSubPageRoutes(rootRoute, content),
  );

  return { router: createRouter({ routeTree, history }), history };
}

/**
 * Host that creates a TanStack router for the page, disposes it on unmount /
 * `AppHistoryApi` identity change, and renders via TanStack `RouterProvider`.
 *
 * The concrete mount prefix changing (e.g. entity A → entity B under the same
 * page) does not recreate the router: the underlying history derives the
 * prefix from `routePattern` and the live location, so the page keeps its
 * in-page state across that navigation. The set of sub-page *paths* does
 * define the route tree, so a change there does rebuild it.
 *
 * @internal
 */
export function TanStackRouterHost(props: {
  routePattern: string;
  subPages?: readonly PageRouterSubPage[];
  indexPath?: string;
  children?: ReactNode;
}) {
  const { routePattern, subPages, indexPath, children } = props;
  const appHistory = useApi(appHistoryApiRef);

  const contentRef = useRef<PageContentRefs>({
    children: { current: children },
    subPages: { current: subPages ?? [] },
    indexPath: { current: indexPath },
  });
  contentRef.current.children.current = children;
  contentRef.current.subPages.current = subPages ?? [];
  contentRef.current.indexPath.current = indexPath;

  const scopedRef = useRef<TanStackScopedRouter | null>(null);
  const routeTreeKey = `${indexPath ?? ''}|${(subPages ?? [])
    .map(subPage => subPage.path)
    .join('|')}`;

  const scoped = useMemo(() => {
    scopedRef.current?.history.destroy();
    const created = createTanStackScopedRouter(
      appHistory,
      routePattern,
      contentRef.current,
    );
    scopedRef.current = created;
    return created;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appHistory, routePattern, routeTreeKey]);

  useEffect(() => {
    return () => {
      scopedRef.current?.history.destroy();
      scopedRef.current = null;
    };
  }, [scoped]);

  return <RouterProvider router={scoped.router} />;
}

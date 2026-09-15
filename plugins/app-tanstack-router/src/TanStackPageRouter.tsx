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
  type ComponentType,
  type ReactNode,
} from 'react';
import { appHistoryApiRef, useApiHolder } from '@backstage/frontend-plugin-api';
import { usePageMount, usePageMountResolver } from '@internal/frontend';
import type { RouterHistory } from '@tanstack/history';
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  type AnyRouter,
} from '@tanstack/react-router';
import { createTanStackHistory } from './createTanStackHistory';

// Content changes without rebuilding the route tree or losing router state.
const PageContentContext = createContext<ReactNode>(undefined);

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

/** Options for {@link createTanStackPageRouter}. @public */
export interface CreateTanStackPageRouterOptions {
  /**
   * Creates the TanStack router using history projected from the framework.
   * The route tree may render `TanStackPageContent` wherever the opaque
   * Backstage page element belongs.
   */
  createRouter(options: { history: RouterHistory }): AnyRouter;
}

/**
 * Creates a page-router component backed by a plugin-owned TanStack route
 * tree. Render the result inside the lazily loaded page or sub-page component that
 * should get the context, the same way {@link TanStackPageRouter} is used.
 *
 * Call this once, at module scope. Each call returns a new component type. A
 * call inside a render body therefore hands React a different type on every
 * render. That unmounts and remounts the whole page subtree, and throws away
 * page state, scroll position and in-flight requests.
 *
 * The component passes its `children` through untouched wherever there is
 * nothing to scope to, and `createRouter` is not called there — see
 * {@link TanStackPageRouter} for what that means and why.
 *
 * @public
 */
export function createTanStackPageRouter(
  options: CreateTanStackPageRouterOptions,
): ComponentType<{ children?: ReactNode }> {
  return function TanStackPageRouterAdapter(props: { children?: ReactNode }) {
    const routePattern = usePageMount()?.routePattern;
    const resolveMount = usePageMountResolver();
    const apiHolder = useApiHolder();
    const appHistory = routePattern
      ? apiHolder.get(appHistoryApiRef)
      : undefined;
    const scoped = useMemo(() => {
      if (!routePattern || !appHistory) {
        return undefined;
      }
      const history = createTanStackHistory(appHistory, {
        routePattern,
        resolveMount,
      });
      return { router: options.createRouter({ history }), history };
    }, [appHistory, routePattern, resolveMount]);
    const lifecycleRef = useRef<{
      generation: number;
      history?: RouterHistory;
    }>({ generation: 0 });

    useEffect(() => {
      if (!scoped) {
        return undefined;
      }
      const { history } = scoped;
      const generation = lifecycleRef.current.generation + 1;
      lifecycleRef.current = { generation, history };
      return () => {
        // StrictMode replays effects with the same history. Dispose only if
        // the replay has not reclaimed it, or a different history replaced it.
        queueMicrotask(() => {
          const current = lifecycleRef.current;
          if (
            current.history !== history ||
            current.generation === generation
          ) {
            history.destroy();
            if (current.history === history) {
              lifecycleRef.current = { generation: current.generation };
            }
          }
        });
      };
    }, [scoped]);

    if (!scoped) {
      return <>{props.children}</>;
    }

    return (
      <PageContentContext.Provider value={props.children}>
        <RouterProvider router={scoped.router} />
      </PageContentContext.Provider>
    );
  };
}

const DefaultTanStackPageRouter = createTanStackPageRouter({
  createRouter: ({ history }) => {
    const rootRoute = createRootRoute({ component: Outlet });
    // The root and splat keep framework-selected content opaque to TanStack.
    const routeTree = rootRoute.addChildren(
      ['/', '/$'].map(path =>
        createRoute({
          getParentRoute: () => rootRoute,
          path,
          component: TanStackPageContent,
        }),
      ),
    );
    return createRouter({ routeTree, history });
  },
});

/**
 * TanStack Router page adapter. Projects the framework's `AppHistoryApi`
 * into a TanStack history, scoped to the page's own mount, and
 * renders the page under a TanStack route tree. Never writes
 * `window.history` via push/replace.
 *
 * Declare it by rendering it inside the lazily loaded page or sub-page component that
 * should get the context:
 *
 * ```tsx
 * // In the lazily loaded page component module:
 * export function ToolsPage() {
 *   return (
 *     <TanStackPageRouter>
 *       {routes}
 *     </TanStackPageRouter>
 *   );
 * }
 * ```
 *
 * In a sub-page's component it scopes itself to that sub-page rather than to
 * the page above it, because the sub-page's own mount is what is in context
 * there. Adapters nest rather than replace one another, so a TanStack sub-page
 * works under a page rendered by any other routing library, and the reverse.
 *
 * The content is opaque: whichever sub-page of a page is showing has already
 * been decided by the framework's own route matching, so this adapter never
 * builds a route for one — and is never handed another library's route tree
 * to host. If the content uses another routing library internally, that is
 * the page author's choice, made alongside their choice of this adapter.
 *
 * Programmatic back and forward traverse the app-owned browser history.
 * Custom histories without entry metadata expose one synthetic slot and cannot
 * provide entry-based restoration or back availability. Push and replace use
 * native TanStack actions; host traversals without metadata have no known delta.
 * Custom hosts must update their location snapshot synchronously for push and
 * replace; traversal notifications can arrive asynchronously.
 *
 * Cross-adapter navigation blockers are not supported because there is no
 * shared blocker seam; `useBlocker` still works for navigation initiated
 * through this page's own TanStack `<Link>` / `router.navigate`.
 *
 * Scoping needs two things: a page mount, saying which part of the URL belongs
 * to the page, and a registered `AppHistoryApi` to project a history from.
 * With either missing this adapter renders `children` untouched — no route
 * tree is built, no router is created — and demands nothing of the surrounding
 * app: no API provider, no framework context. That passthrough is what lets
 * one component wrap itself in the adapter and still ship for both frontend
 * systems: under the old frontend system there is no page mount and no app
 * history, and the wrap has to be invisible rather than a crash. The same
 * holds in a plugin's own `render()` unit tests.
 *
 * @public
 */
export function TanStackPageRouter(props: { children?: ReactNode }) {
  return (
    <DefaultTanStackPageRouter>{props.children}</DefaultTanStackPageRouter>
  );
}

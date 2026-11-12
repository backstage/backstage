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
import {
  appHistoryApiRef,
  NavigationProvider,
  type Navigation,
  useApi,
  useApiHolder,
  useRouteResolution,
} from '@backstage/frontend-plugin-api';
import { isExternalTarget, sanitizeHref } from '@internal/frontend';
import type { RouterHistory } from '@tanstack/history';
import {
  Outlet,
  useRouter,
  useMatch,
  useLocation,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  resolvePath,
  type AnyRouter,
  type AnyRoute,
  type BuildNextOptions,
  type ParsedLocation,
} from '@tanstack/react-router';
import { createTanStackHistory } from './createTanStackHistory';

/** Resolves authored targets using the same route scope as a native TanStack Link. */
function useAdapterNavigation(): Navigation {
  const history = useApi(appHistoryApiRef);
  const router = useRouter();
  const from = useMatch({
    strict: false,
    select: (match): string => match.fullPath,
  });
  const location = useLocation();
  const resolve = (to: string) => {
    const safeTo = sanitizeHref(to);
    if (isExternalTarget(safeTo)) {
      return safeTo;
    }
    // TanStack exposes search and hash as separate options, while this contract accepts string targets.
    const url = new URL(safeTo, 'http://backstage.local');
    const pathname = safeTo.split(/[?#]/, 1)[0];
    return router.buildLocation({
      from,
      to: pathname || location.pathname,
      search: router.options.parseSearch!(url.search),
      hash: url.hash.slice(1),
    }).href;
  };
  return {
    createHref: to => history.createHref(resolve(to)),
    navigate: (to, options) => {
      const target = resolve(to);
      if (isExternalTarget(target)) {
        history.navigate(target, options);
      } else {
        void router.navigate({
          href: target,
          replace: options?.replace,
          state: options?.state as Record<string, unknown>,
        });
      }
    },
    pathname: new URL(
      history.createHref(location.pathname),
      'http://backstage.local',
    ).pathname,
  };
}

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
  createRouter(options: {
    history: RouterHistory;
    /**
     * App-absolute mount patterns in TanStack syntax. Optional segments
     * produce multiple unique patterns, preserving earlier parameter names when
     * patterns have the same shape. Mount a route tree at each pattern, never by
     * setting basepath. For `/`, attach the routes directly to the root route.
     */
    routePaths: readonly string[];
  }): AnyRouter;
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
    const mount = useRouteResolution().matches.at(-1);
    const routePattern = mount?.routePattern;
    const appHistory = useApiHolder().get(appHistoryApiRef);
    const scoped = useMemo(() => {
      if (!routePattern || !appHistory) {
        return undefined;
      }
      const history = createTanStackHistory(appHistory);
      // Keep required variants first, as the framework does. Deduplicate each
      // expansion by shape so equivalent paths retain the earlier param name.
      const routePaths = routePattern
        .replace(/\/\*$/, '')
        .split('/')
        .filter(Boolean)
        .reduce((paths, segment) => {
          const optional = segment.endsWith('?');
          const required = segment.replace(/\?$/, '');
          const param = required.match(/^:([\w-]+)(\?)?(.*)$/);
          const part = param ? `{$${param[1]}}${param[3]}` : required;
          const shape = param ? `{$param}${param[3]}` : required;
          const expanded = new Map<string, string>();
          for (const [pathShape, path] of paths) {
            const candidates = [[`${pathShape}/${shape}`, `${path}/${part}`]];
            // :name?.json omits the value and its slash, but keeps the suffix.
            if (param?.[2] && path) {
              candidates.push([
                `${pathShape}${param[3]}`,
                `${path}${param[3]}`,
              ]);
            }
            if (optional) {
              candidates.push([pathShape, path]);
            }
            for (const [candidateShape, candidate] of candidates) {
              if (!expanded.has(candidateShape)) {
                expanded.set(candidateShape, candidate);
              }
            }
          }
          return expanded;
        }, new Map([['', '']]));
      const router = options.createRouter({
        history,
        routePaths: [...routePaths.values()].map(path => path || '/'),
      });
      if (router.basepath !== '/') {
        throw new Error(
          'TanStack page routers must use the app root as basepath. Mount routes using routePaths instead.',
        );
      }
      const originalParams = new Map<AnyRoute, AnyRoute['options']['params']>();
      for (const route of Object.values(router.routesById)) {
        const mountPath = [...routePaths.values()].find(
          path =>
            path &&
            (route.fullPath === path || route.fullPath.startsWith(`${path}/`)),
        );
        const names = [
          ...(mountPath ?? '').matchAll(/\{\$([\w-]+)\}[^/]+/g),
        ].map(match => match[1]);
        if (!names.length) {
          continue;
        }
        const parse = route.options.params?.parse ?? route.options.parseParams;
        originalParams.set(route, route.options.params);
        route.options.params = {
          ...route.options.params,
          parse: (params: Record<string, string>) => {
            // The framework requires a nonempty value before a literal suffix.
            if (names.some(name => params[name] === '')) {
              return false;
            }
            return parse ? parse(params) : {};
          },
        };
      }
      if (originalParams.size) {
        try {
          router.setRoutes(router.buildRouteTree());
        } finally {
          for (const [route, params] of originalParams) {
            route.options.params = params;
          }
        }
      }
      // Keep the adapter's app-absolute encoded locations while the newer
      // matcher handles decoding individual parameters.
      const parseLocation = router.parseLocation;
      router.parseLocation = (location, previous) => {
        const parsed = parseLocation(location, previous);
        if (router.options.rewrite || parsed.maskedLocation) {
          return parsed;
        }
        return {
          ...parsed,
          pathname: location.pathname,
          hash: location.hash.slice(1),
        };
      };
      const getMatchedRoutes = router.getMatchedRoutes;
      router.getMatchedRoutes = (pathname, ...args) => {
        const decoded = router.options.rewrite
          ? pathname
          : parseLocation({
              ...history.location,
              pathname,
              href: pathname,
              search: '',
              hash: '',
              state: { __TSR_index: 0 },
            }).pathname;
        return getMatchedRoutes(decoded, ...args);
      };
      const buildLocation = router.buildLocation as (
        location: BuildNextOptions & { leaveParams?: boolean },
      ) => ParsedLocation;
      router.buildLocation = locationOptions => {
        const destination = { ...locationOptions } as BuildNextOptions & {
          leaveParams?: boolean;
        };
        const to = locationOptions.to && String(locationOptions.to);
        if (to && !to.startsWith('/')) {
          const location =
            locationOptions._fromLocation ?? router.latestLocation;
          const matches = router.matchRoutes(location);
          const from = locationOptions.from ?? matches.at(-1)?.fullPath ?? '/';
          const resolved = resolvePath({ base: from, to });
          const splat = resolved.match(/^(.*?\/\$)(\/.+)$/);
          if (splat) {
            // Newer TanStack interpolation discards everything after a splat.
            // Resolve the mount before appending the relative tail.
            const currentParams = matches.at(-1)?.params ?? {};
            let params = {};
            if (
              locationOptions.params !== false &&
              locationOptions.params !== null
            ) {
              params = { ...currentParams };
              if (typeof locationOptions.params === 'function') {
                Object.assign(params, locationOptions.params(currentParams));
              } else if (locationOptions.params !== true) {
                Object.assign(params, locationOptions.params);
              }
            }
            const prefix = buildLocation({
              ...destination,
              to: splat[1],
              params: () => params,
            }).pathname;
            destination.to = `${prefix}${splat[2]}`;
            destination.params = () => params;
          }
        }
        const result = buildLocation(destination);
        return {
          ...result,
          pathname: locationOptions.leaveParams
            ? result.pathname
            : new URL(result.href, 'http://backstage.local').pathname,
        };
      };
      router.updateLatestLocation();
      return { router, history };
    }, [appHistory, routePattern]);
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
        <NavigationProvider useNavigation={useAdapterNavigation}>
          <RouterProvider router={scoped.router} />
        </NavigationProvider>
      </PageContentContext.Provider>
    );
  };
}

const DefaultTanStackPageRouter = createTanStackPageRouter({
  createRouter: ({ history, routePaths }) => {
    const rootRoute = createRootRoute({ component: Outlet });
    // The mount and splat keep framework-selected content opaque to TanStack.
    const routeTree = rootRoute.addChildren(
      routePaths.flatMap(routePath =>
        [routePath, `${routePath === '/' ? '' : routePath}/$`].map(path =>
          createRoute({
            getParentRoute: () => rootRoute,
            path,
            component: TanStackPageContent,
          }),
        ),
      ),
    );
    return createRouter({ routeTree, history });
  },
});

/**
 * TanStack Router page adapter. Projects the framework's `AppHistoryApi`
 * into a TanStack history with app-absolute paths, and
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

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
  createElement,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import type {
  AppHistoryApi,
  FrameworkLocation,
} from '@backstage/frontend-plugin-api';
import type {
  AdapterLocation,
  AdapterTo,
  CreateScopedRouterWithBindingsOptions,
  ReactRouterAdapterBindings,
  ScopedRouterWithBindingsResult,
} from './types';

/** The neutral "not on this page" RouteContext, shared so it stays stable. */
const EMPTY_ROUTE_CONTEXT = {
  outlet: null,
  matches: [] as any[],
  isDataRoute: false,
};

function toAdapterLocation(loc: FrameworkLocation): AdapterLocation {
  return {
    pathname: loc.pathname,
    search: loc.search,
    hash: loc.hash,
    state: loc.state ?? null,
    key: 'default',
  };
}

function toPath(to: AdapterTo, currentPathname: string): string {
  if (typeof to === 'string') {
    return to;
  }
  // Use the current pathname when To.pathname is undefined (e.g.
  // useSearchParams updates only the search params).
  const { pathname = currentPathname, search = '', hash = '' } = to;
  return `${pathname}${search}${hash}`;
}

/**
 * Creates a React Router context adapter projected from the framework's
 * {@link AppHistoryApi}, using version-specific APIs supplied by the caller.
 *
 * Injects `UNSAFE_*` contexts directly (never nests `<Router>` / writes
 * `window.history` via push/replace) — `AppHistoryApi` remains the sole
 * history authority. The location fed into React Router context is the real
 * app-absolute location (not translated/scoped), so React Router's own
 * relative-path resolution produces app-absolute targets that are handed to
 * `appHistory.navigate` unchanged.
 *
 * The injected `UNSAFE_RouteContext` reproduces the match a real
 * `<Route path={`${routePattern}/*`}>` would have produced for the current
 * location, so `useParams`, relative `Link` targets and descendant `<Routes>`
 * behave exactly as they do under a root router of the same React Router
 * version. It is derived by matching, never from a separately supplied
 * `basePath`, so it cannot drift out of step with the location it describes.
 *
 * `go` is not supported by `AppHistoryApi` (there is a single, real browser
 * history — use browser back/forward). Calling `navigate(-1)` warns and is a
 * no-op, matching the framework root router (`RootHistoryRouter`).
 *
 * @internal
 */
export function createScopedRouterWithBindings(
  bindings: ReactRouterAdapterBindings,
  appHistory: AppHistoryApi,
  options: CreateScopedRouterWithBindingsOptions,
): ScopedRouterWithBindingsResult {
  const { routePattern, navigationContextExtras = {} } = options;

  const normalizedPattern =
    routePattern === '/' ? '/' : routePattern.replace(/\/$/, '');
  const splatPattern =
    normalizedPattern === '/' ? '/*' : `${normalizedPattern}/*`;

  // useSyncExternalStore requires getSnapshot() to return a referentially
  // stable value between store events, or it will loop forever re-rendering.
  // Track the latest location in plain closure variables (updated only by the
  // subscription callback below), mirroring how AppHistoryApi itself is
  // implemented, rather than recomputing a fresh object on every call.
  let sourceLocation: FrameworkLocation = appHistory.location;
  let latestLocation: AdapterLocation = toAdapterLocation(sourceLocation);
  const listeners = new Set<() => void>();
  let subscription: { unsubscribe(): void } | undefined;

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    if (!subscription) {
      subscription = appHistory.location$.subscribe(loc => {
        // `AppHistoryApi.location` is a stable reference, so an observable
        // that replays its current value on subscribe is a no-op here rather
        // than a spurious re-render with an equal-but-new location object.
        if (loc === sourceLocation) {
          return;
        }
        sourceLocation = loc;
        latestLocation = toAdapterLocation(loc);
        for (const each of listeners) {
          each();
        }
      });
    }
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        subscription?.unsubscribe();
        subscription = undefined;
      }
    };
  }

  function getSnapshot(): AdapterLocation {
    return latestLocation;
  }

  function buildRouteMatches(location: AdapterLocation) {
    // Prefer a splat match so in-plugin nested Routes / useParams['*'] work,
    // and so descendant `<Routes>` see a parent route path that ends in `*`.
    // Fall back to an exact-prefix match so relative Links from the page root
    // (e.g. `/catalog` + `./create`) resolve against pathnameBase `/catalog`
    // rather than treating the last segment as a file name.
    const match =
      bindings.matchPath(
        { path: splatPattern, end: false },
        location.pathname,
      ) ??
      bindings.matchPath(
        { path: normalizedPattern, end: false },
        location.pathname,
      );

    // A location outside the page's own pattern only happens while the app is
    // navigating away, i.e. for the render just before this page unmounts. A
    // real router would not have rendered the page at all, so the neutral
    // no-route context is the honest answer — inventing a match here is what
    // makes a stale prefix leak back out through relative navigation.
    if (!match) {
      return EMPTY_ROUTE_CONTEXT;
    }

    return {
      outlet: null,
      matches: [
        {
          params: match.params,
          pathname: match.pathname,
          pathnameBase: match.pathnameBase,
          route: {
            path: match.pattern.path,
            caseSensitive: false,
            children: undefined,
            element: null,
            index: false,
            id: 'page',
          },
        },
      ] as any[],
      isDataRoute: false,
    };
  }

  function ScopedRouter({ children }: { children: ReactNode }) {
    const location = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    const locationContextValue = useMemo(
      () => ({ location, navigationType: bindings.NavigationType.Pop }),
      [location],
    );

    const navigator = useMemo(
      () => ({
        createHref(to: AdapterTo): string {
          const path =
            typeof to === 'string'
              ? to
              : `${to.pathname ?? ''}${to.search ?? ''}${to.hash ?? ''}`;
          return appHistory.createHref(path);
        },
        go(_delta: number): void {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(
              '[createScopedRouter] navigator.go() is not supported by the ' +
                'framework app history; use the browser’s own ' +
                'back/forward instead.',
            );
          }
        },
        // React Router resolves relative `to` targets against the pathname we
        // supply via LocationContext (the real app-absolute pathname), so the
        // resolved path handed to push/replace is already app-absolute — no
        // further translation needed.
        push(to: AdapterTo, state?: any): void {
          appHistory.navigate(toPath(to, latestLocation.pathname), {
            replace: false,
            state,
          });
        },
        replace(to: AdapterTo, state?: any): void {
          appHistory.navigate(toPath(to, latestLocation.pathname), {
            replace: true,
            state,
          });
        },
      }),
      // latestLocation / appHistory / options are stable for this scoped
      // router instance
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    const navigationContextValue = useMemo(
      () => ({
        basename: '',
        navigator,
        static: false,
        ...navigationContextExtras,
      }),
      [navigator],
    );

    const routeContextValue = useMemo(
      () => buildRouteMatches(location),
      [location],
    );

    return createElement(
      bindings.UNSAFE_NavigationContext.Provider,
      { value: navigationContextValue },
      createElement(
        bindings.UNSAFE_LocationContext.Provider,
        { value: locationContextValue },
        createElement(
          bindings.UNSAFE_RouteContext.Provider,
          { value: routeContextValue },
          children,
        ),
      ),
    );
  }

  return {
    Router: ScopedRouter,
    useLocation: (): AdapterLocation => bindings.useLocation(),
    useNavigate: () => bindings.useNavigate(),
    useParams: <T extends Record<string, string | undefined>>(): T =>
      bindings.useParams() as T,
    useSearchParams: (...args: any[]) => bindings.useSearchParams(...args),
  };
}

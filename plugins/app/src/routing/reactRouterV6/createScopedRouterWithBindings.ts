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
import type { AppHistoryApi } from '@backstage/frontend-plugin-api';
import type {
  AdapterLocation,
  AdapterTo,
  CreateScopedRouterWithBindingsOptions,
  ReactRouterAdapterBindings,
  ScopedRouterWithBindingsResult,
} from './types';

/**
 * Creates a React Router context adapter projected from the framework's
 * {@link AppHistoryApi}, using version-specific APIs supplied by the caller.
 *
 * Injects `UNSAFE_*` contexts directly (never nests `<Router>` / writes
 * `window.history` via push/replace) — `AppHistoryApi` remains the sole
 * history authority. The location fed into React Router context is the
 * real app-absolute location (not translated/scoped), so React Router's own
 * relative-path resolution produces app-absolute targets that are handed to
 * `appHistory.navigate` unchanged.
 *
 * @internal
 */
export function createScopedRouterWithBindings(
  bindings: ReactRouterAdapterBindings,
  appHistory: AppHistoryApi,
  options: CreateScopedRouterWithBindingsOptions,
): ScopedRouterWithBindingsResult {
  const { basePath, routePattern, navigationContextExtras = {} } = options;
  const goDelta =
    options.go ??
    ((delta: number) => {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(
          `[createScopedRouter] navigator.go(${delta}) called without a ` +
            '`go` option. The framework app history does not support ' +
            'programmatic back/forward; window.history.go is never used as ' +
            'a fallback.',
        );
      }
    });

  function toAdapterLocation(loc: {
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
  }): AdapterLocation {
    return {
      pathname: loc.pathname,
      search: loc.search,
      hash: loc.hash,
      state: loc.state ?? null,
      key: 'default',
    };
  }

  // Store for useSyncExternalStore — the initial value is captured
  // synchronously since AppHistoryApi.location$ emits synchronously on
  // subscribe.
  let latestLocation: AdapterLocation = toAdapterLocation({
    pathname: basePath,
    search: '',
    hash: '',
    state: null,
  });

  const initialSub = appHistory.location$.subscribe(loc => {
    latestLocation = toAdapterLocation(loc);
  });
  initialSub.unsubscribe();

  // Set of listener callbacks for useSyncExternalStore
  const listeners = new Set<() => void>();

  // Subscription reference — managed by useSyncExternalStore's subscribe lifecycle.
  let subscription: { unsubscribe(): void } | undefined;

  function subscribeToAppHistory(): void {
    if (subscription) return;
    subscription = appHistory.location$.subscribe(loc => {
      latestLocation = toAdapterLocation(loc);
      for (const listener of listeners) {
        listener();
      }
    });
  }

  function unsubscribeFromAppHistory(): void {
    subscription?.unsubscribe();
    subscription = undefined;
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    subscribeToAppHistory();
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        unsubscribeFromAppHistory();
      }
    };
  }

  function getSnapshot(): AdapterLocation {
    return latestLocation;
  }

  function buildRouteMatches(location: AdapterLocation) {
    if (!routePattern) {
      return {
        outlet: null,
        matches: [] as any[],
        isDataRoute: false,
      };
    }

    const normalizedPattern =
      routePattern === '/' ? '/' : routePattern.replace(/\/$/, '');
    const splatPattern =
      normalizedPattern === '/' ? '/*' : `${normalizedPattern}/*`;

    // Prefer a splat match so in-plugin nested Routes / useParams['*'] work.
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

    if (!match) {
      return {
        outlet: null,
        matches: [] as any[],
        isDataRoute: false,
      };
    }

    const params = match.params;
    return {
      outlet: null,
      matches: [
        {
          params,
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
      () => ({
        location,
        navigationType: bindings.NavigationType.Pop,
      }),
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
        go(delta: number): void {
          goDelta(delta);
        },
        // React Router resolves relative `to` targets against the pathname
        // we supply via LocationContext (the real app-absolute pathname),
        // so the resolved path handed to push/replace is already
        // app-absolute — no further translation needed.
        push(to: AdapterTo, state?: any, _opts?: any): void {
          appHistory.navigate(toPath(to, latestLocation.pathname), {
            replace: false,
            state,
          });
        },
        replace(to: AdapterTo, state?: any, _opts?: any): void {
          appHistory.navigate(toPath(to, latestLocation.pathname), {
            replace: true,
            state,
          });
        },
      }),
      // latestLocation / appHistory / options are stable for this scoped router instance
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
    dispose: () => {
      unsubscribeFromAppHistory();
      listeners.clear();
    },
  };
}

function toPath(to: AdapterTo, currentPathname: string): string {
  if (typeof to === 'string') {
    return to;
  }
  // Use current pathname when To.pathname is undefined (e.g., useSearchParams
  // updates only search params without specifying a pathname)
  const { pathname = currentPathname, search = '', hash = '' } = to;
  return `${pathname}${search}${hash}`;
}

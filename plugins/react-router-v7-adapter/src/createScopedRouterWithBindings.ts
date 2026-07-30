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
  useRef,
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

function toAdapterLocation(loc: FrameworkLocation): AdapterLocation {
  return {
    pathname: loc.pathname,
    search: loc.search,
    hash: loc.hash,
    state: loc.state ?? null,
    key: 'default',
  };
}

/**
 * Creates a React Router context adapter bound to the framework's
 * {@link AppHistoryApi}, using version-specific APIs supplied by the caller.
 *
 * Injects `UNSAFE_*` contexts directly (never nests `<Router>` / writes
 * `window.history` via push/replace). Navigation is delegated to
 * `appHistory.navigate` with app-absolute paths — `AppHistoryApi.location$`
 * already emits app-absolute (basename-stripped) locations, so no
 * scoped/app-absolute translation is needed here.
 *
 * `basePath` + `routePattern` are used only to populate the injected
 * `UNSAFE_RouteContext` (so `useParams` and relative-Link `pathnameBase`
 * resolve the same way they did under a root router) — they never affect
 * the location handed to React Router itself.
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
  const { basePathRef, routePattern, navigationContextExtras = {} } = options;

  // useSyncExternalStore requires getSnapshot() to return a referentially
  // stable value between store events, or it will loop forever re-rendering.
  // Track the latest location in a plain closure variable (updated only by
  // the subscription callback below), mirroring how AppHistoryApi itself is
  // implemented, rather than recomputing a fresh object on every call.
  let latestLocation: AdapterLocation = toAdapterLocation(
    readCurrentAppLocation(),
  );
  const listeners = new Set<() => void>();
  let subscription: { unsubscribe(): void } | undefined;

  function readCurrentAppLocation(): FrameworkLocation {
    let current!: FrameworkLocation;
    const sub = appHistory.location$.subscribe(loc => {
      current = loc;
    });
    sub.unsubscribe();
    return current;
  }

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
    const basePath = basePathRef.current;
    const normalizedPattern =
      routePattern === '/' ? '/' : routePattern.replace(/\/$/, '');
    const splatPattern =
      normalizedPattern === '/' ? '/*' : `${normalizedPattern}/*`;

    // Prefer a splat match so in-plugin nested Routes / useParams['*'] work.
    const match =
      bindings.matchPath(
        { path: splatPattern, end: false },
        location.pathname,
      ) ??
      bindings.matchPath(
        { path: normalizedPattern, end: false },
        location.pathname,
      );

    return {
      outlet: null,
      matches: [
        {
          params: match?.params ?? {},
          pathname: basePath,
          pathnameBase: basePath,
          route: {
            path: routePattern,
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
    const locationRef = useRef(location);
    locationRef.current = location;

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
                'framework app history; use browser back/forward instead.',
            );
          }
        },
        push(to: AdapterTo, state?: any): void {
          const path = toPath(to, locationRef.current.pathname);
          appHistory.navigate(path, { replace: false, state });
        },
        replace(to: AdapterTo, state?: any): void {
          const path = toPath(to, locationRef.current.pathname);
          appHistory.navigate(path, { replace: true, state });
        },
      }),
      // locationRef / appHistory are stable for this scoped router instance
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

function toPath(to: AdapterTo, currentPathname: string): string {
  if (typeof to === 'string') {
    return to;
  }
  // Use current pathname when To.pathname is undefined (e.g., useSearchParams
  // updates only search params without specifying a pathname)
  const { pathname = currentPathname, search = '', hash = '' } = to;
  return `${pathname}${search}${hash}`;
}

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
import type { RoutingContract } from '@backstage/frontend-plugin-api';
import type {
  AdapterLocation,
  AdapterTo,
  CreateScopedRouterWithBindingsOptions,
  ReactRouterAdapterBindings,
  ScopedRouterWithBindingsResult,
} from './types';

/**
 * Creates a React Router context adapter bound to a RoutingContract, using
 * version-specific APIs supplied by the caller.
 *
 * Injects `UNSAFE_*` contexts directly (never nests `<Router>` / writes
 * `window.history` via push/replace). Navigation is delegated to
 * `contract.navigate`; back/forward uses `contract.go`, or the `go` option
 * when provided as an override.
 *
 * Location exposed to React Router is **app-absolute** (`basePath` + scoped
 * pathname) so relative Links and in-plugin `Routes` resolve the same way they
 * did under a root router. `contract.navigate` still receives paths scoped to
 * `basePath`.
 *
 * @internal
 */
export function createScopedRouterWithBindings(
  bindings: ReactRouterAdapterBindings,
  contract: RoutingContract,
  options?: CreateScopedRouterWithBindingsOptions,
): ScopedRouterWithBindingsResult {
  if (!contract) {
    throw new Error(
      'createScopedRouter requires a RoutingContract. Ensure this component is rendered inside a page that provides RoutingContractContext.',
    );
  }

  const routePattern = options?.routePattern;
  const appBasename = options?.appBasename ?? '';
  const navigationContextExtras = options?.navigationContextExtras ?? {};
  const goDelta =
    options?.go ??
    (typeof contract.go === 'function'
      ? (delta: number) => contract.go(delta)
      : (delta: number) => {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(
              `[createScopedRouter] navigator.go(${delta}) called without ` +
                `contract.go or a \`go\` option. Prefer RoutingContract.go; ` +
                `window.history.go is never used as a fallback.`,
            );
          }
        });

  // Store for useSyncExternalStore — keeps the latest app-absolute location.
  // The initial value is captured synchronously since contract.location$ emits
  // synchronously on subscribe.
  let latestLocation: AdapterLocation = {
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'default',
  };

  function toAppAbsolute(scopedPathname: string): string {
    if (contract.basePath === '/') {
      return scopedPathname || '/';
    }
    if (scopedPathname === '/' || scopedPathname === '') {
      return contract.basePath;
    }
    const suffix = scopedPathname.startsWith('/')
      ? scopedPathname
      : `/${scopedPathname}`;
    return `${contract.basePath}${suffix}`;
  }

  function toContractPath(appPath: string): string {
    if (contract.basePath === '/') {
      return appPath;
    }
    if (appPath === contract.basePath) {
      return '/';
    }
    if (appPath.startsWith(`${contract.basePath}/`)) {
      return appPath.slice(contract.basePath.length) || '/';
    }
    // Out of scope — pass through; contract.navigate will warn and block.
    return appPath;
  }

  // Capture the initial value synchronously
  const initialSub = contract.location$.subscribe(loc => {
    latestLocation = {
      pathname: toAppAbsolute(loc.pathname),
      search: loc.search,
      hash: loc.hash,
      state: loc.state ?? null,
      key: 'default',
    };
  });
  initialSub.unsubscribe();

  // Set of listener callbacks for useSyncExternalStore
  const listeners = new Set<() => void>();

  // Subscription reference — managed by useSyncExternalStore's subscribe lifecycle.
  let subscription: { unsubscribe(): void } | undefined;

  function subscribeToContract(): void {
    if (subscription) return;
    subscription = contract.location$.subscribe(routingLocation => {
      latestLocation = {
        pathname: toAppAbsolute(routingLocation.pathname),
        search: routingLocation.search,
        hash: routingLocation.hash,
        state: routingLocation.state ?? null,
        key: 'default',
      };
      for (const listener of listeners) {
        listener();
      }
    });
  }

  function unsubscribeFromContract(): void {
    subscription?.unsubscribe();
    subscription = undefined;
  }

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    subscribeToContract();
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        unsubscribeFromContract();
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
          if (!appBasename) {
            return path;
          }
          const url = new URL(path, 'http://localhost');
          return `${appBasename}${url.pathname}${url.search}${url.hash}`;
        },
        go(delta: number): void {
          goDelta(delta);
        },
        push(to: AdapterTo, state?: any, _opts?: any): void {
          const path =
            typeof to === 'string'
              ? to
              : createPath(to, latestLocation.pathname);
          contract.navigate(toContractPath(path), { replace: false, state });
        },
        replace(to: AdapterTo, state?: any, _opts?: any): void {
          const path =
            typeof to === 'string'
              ? to
              : createPath(to, latestLocation.pathname);
          contract.navigate(toContractPath(path), { replace: true, state });
        },
      }),
      // latestLocation / contract / options are stable for this scoped router instance
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
      unsubscribeFromContract();
      listeners.clear();
    },
  };
}

function createPath(
  to: Partial<{ pathname: string; search: string; hash: string }>,
  currentPathname: string,
): string {
  // Use current pathname when To.pathname is undefined (e.g., useSearchParams
  // updates only search params without specifying a pathname)
  const { pathname = currentPathname, search = '', hash = '' } = to;
  return `${pathname}${search}${hash}`;
}

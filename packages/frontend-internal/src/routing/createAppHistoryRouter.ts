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
  useContext,
  useMemo,
  type ComponentType,
  type Context,
  type ReactNode,
} from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';
import type {
  AppHistoryApi,
  AppLocation,
} from '@backstage/frontend-plugin-api';
import { usePageMountChain, type PageMount } from './PageMountContext';
import {
  readAppHistoryMetadata,
  type AppHistoryAction,
  type AppHistoryMetadata,
} from './AppHistoryMetadata';
import { expandOptionalSegments, matchPath } from './routePattern';
import {
  observeReactRouterContext,
  unwrapReactRouterContext,
} from './legacyRouterContext';

/**
 * Minimal location shape shared by React Router v6 and v7.
 */
export interface AdapterLocation {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  key: string;
}

/**
 * Destination accepted by React Router navigators.
 */
export type AdapterTo =
  | string
  | Partial<{ pathname: string; search: string; hash: string }>;

/**
 * Path-match result used to seed RouteContext.
 */
export interface AdapterPathMatch {
  pathname: string;
  pathnameBase: string;
  pattern: { path: string };
  params: Record<string, string | undefined>;
}

/**
 * React Router APIs injected into {@link createAppHistoryRouter} so that
 * helper never has to hard-code a specific `react-router` version — the
 * package that owns the version supplies its own imports.
 */
export interface ReactRouterAdapterBindings {
  NavigationType: { Pop: unknown; Push: unknown; Replace: unknown };
  matchPath: (
    pattern: { path: string; end?: boolean },
    pathname: string,
  ) => AdapterPathMatch | null;
  UNSAFE_NavigationContext: Context<unknown>;
  UNSAFE_LocationContext: Context<unknown>;
  UNSAFE_RouteContext: Context<unknown>;
}

/**
 * Version-specific fields merged into NavigationContext (v6 future flags vs
 * v7 `future` / `useTransitions`).
 */
export type NavigationContextExtras = Record<string, unknown>;

/**
 * Options for {@link createAppHistoryRouter}.
 */
export interface CreateAppHistoryRouterOptions {
  /** Report consumption of an implicit compatibility router. */
  onUse?: () => void;
  /**
   * Registered page route pattern (e.g. `/catalog` or
   * `/catalog/:namespace/:kind/:name`), for a router mounted at a page.
   *
   * Framework mounts supply the selected base path and decoded params. The
   * projection combines these with the live location's splat tail, preserving
   * optional branch selection and encoded paths. Explicit isolated mounts
   * instead derive their match from this pattern and the live location.
   *
   * Left out for a router at app root scope (app chrome), which is not
   * mounted under any route and therefore publishes an empty route context.
   */
  routePattern?: string;
  /**
   * Extra NavigationContext fields that differ between React Router major
   * versions (e.g. v6 `future.v7_relativeSplatPath` vs v7 `useTransitions`).
   */
  navigationContextExtras?: NavigationContextExtras;
}

/**
 * Result of {@link createAppHistoryRouter}.
 */
export interface AppHistoryRouterResult {
  /** React component that provides React Router context for its children. */
  Router: ComponentType<{ children: ReactNode }>;
}

/** The neutral "not on this page" RouteContext, shared so it stays stable. */
const EMPTY_ROUTE_CONTEXT = {
  outlet: null,
  matches: [] as any[],
  isDataRoute: false,
};

/**
 * Whether `ancestorBase` is a route base strictly above `base`, i.e. the
 * containment a parent match has over a child match in a real route tree.
 */
function isAncestorBase(ancestorBase: unknown, base: string): boolean {
  if (typeof ancestorBase !== 'string' || ancestorBase === base) {
    return false;
  }
  return ancestorBase === '/' || base.startsWith(`${ancestorBase}/`);
}

// Shared across inlined copies so equal-base ancestors can be distinguished
// from a second projection of the current mount.
const projectedMountSymbol = Symbol.for(
  '@backstage/frontend-internal/projected-page-mount',
);

/** Keeps actual projected ancestors, falling back to URL containment for native matches. */
function takeAncestorMatches(
  parentMatches: readonly any[],
  pathnameBase: string,
  ancestorMounts: readonly PageMount[],
): any[] {
  let count = 0;
  while (
    count < parentMatches.length &&
    (isAncestorBase(parentMatches[count]?.pathnameBase, pathnameBase) ||
      ancestorMounts.includes(
        parentMatches[count]?.route?.[projectedMountSymbol],
      ))
  ) {
    count += 1;
  }
  return parentMatches.slice(0, count);
}

/** Normalizes a registered route pattern to the form matching expects. */
function normalizePattern(pattern: string): string {
  return pattern === '/' ? '/' : pattern.replace(/\/$/, '') || '/';
}

/**
 * The location key React Router itself uses for an entry it has no key for.
 * A history that does not implement the metadata capability has no keys to
 * project, so every location it reports carries this one.
 */
const UNKEYED_LOCATION_KEY = 'default';

function toAdapterLocation(
  loc: AppLocation,
  metadata: AppHistoryMetadata | undefined,
): AdapterLocation {
  return {
    pathname: loc.pathname,
    search: loc.search,
    hash: loc.hash,
    state: loc.state ?? null,
    key: metadata?.key ?? UNKEYED_LOCATION_KEY,
  };
}

function toNavigationType(
  bindings: ReactRouterAdapterBindings,
  action: AppHistoryAction,
): unknown {
  if (action === 'PUSH') {
    return bindings.NavigationType.Push;
  }
  if (action === 'REPLACE') {
    return bindings.NavigationType.Replace;
  }
  return bindings.NavigationType.Pop;
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
 * With a `routePattern`, the injected `UNSAFE_RouteContext` reproduces the
 * match a real `<Route path={`${routePattern}/*`}>` would have produced for
 * the current location, so `useParams`, relative `Link` targets and
 * descendant `<Routes>` behave exactly as they do under a root router of the
 * same React Router version. The framework's selected mount disambiguates
 * optional segments; isolated contexts use pattern matching alone.
 * Without a pattern, the projection is at app root scope and
 * publishes the neutral empty route context instead.
 *
 * That match is *appended* to the mounts this projection is nested inside
 * rather than replacing them, so a sub-page publishes a stack of the same depth
 * a real nested `<Routes>` would, and `..` walks up to the parent page instead
 * of to the app root. Those ancestors are taken from the surrounding route
 * context when it has any, and otherwise from the framework's own chain of page
 * mounts — which is what keeps a relative target meaning the same thing when
 * the page above the sub-page is routed by a different library, or by none. At
 * page scope there is nothing above but app chrome, so the stack is the
 * projected match alone.
 *
 * Numeric traversal delegates to `AppHistoryApi`, as push and replace do,
 * so the framework remains the sole history authority.
 */
export function createAppHistoryRouter(
  bindings: ReactRouterAdapterBindings,
  appHistory: AppHistoryApi,
  options: CreateAppHistoryRouterOptions = {},
): AppHistoryRouterResult {
  const { routePattern, navigationContextExtras = {}, onUse } = options;

  const normalizedPattern =
    routePattern === undefined ? undefined : normalizePattern(routePattern);

  // useSyncExternalStore requires getSnapshot() to return a referentially
  // stable value between store events, or it will loop forever re-rendering.
  // Track the latest location in plain closure variables (updated only by the
  // subscription callback below), mirroring how AppHistoryApi itself is
  // implemented, rather than recomputing a fresh object on every call.
  let sourceLocation: AppLocation = appHistory.location;
  // `undefined` throughout when the history does not implement the metadata
  // capability. Nothing here synthesizes a substitute: this adapter only needs
  // a location key and a navigation type, and both have a defined meaning for
  // a history that reports neither.
  let latestMetadata: AppHistoryMetadata | undefined =
    readAppHistoryMetadata(appHistory);
  let latestLocation: AdapterLocation = toAdapterLocation(
    sourceLocation,
    latestMetadata,
  );
  const listeners = new Set<() => void>();
  let subscription: { unsubscribe(): void } | undefined;

  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    if (!subscription) {
      subscription = appHistory.location$.subscribe(loc => {
        const metadata = readAppHistoryMetadata(appHistory);
        // `AppHistoryApi.location` is a stable reference, so an observable
        // that replays its current value on subscribe is a no-op here rather
        // than a spurious re-render with an equal-but-new location object.
        if (
          loc === sourceLocation &&
          metadata?.key === latestMetadata?.key &&
          metadata?.action === latestMetadata?.action
        ) {
          return;
        }
        sourceLocation = loc;
        latestMetadata = metadata;
        latestLocation = toAdapterLocation(loc, metadata);
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

  /**
   * Matches a mount's route pattern against a pathname the way a real
   * `<Route path={`${pattern}/*`}>` would.
   *
   * Prefers a splat match so in-plugin nested Routes / useParams['*'] work, and
   * so descendant `<Routes>` see a parent route path that ends in `*`. Falls
   * back to an exact-prefix match so relative Links from the page root (e.g.
   * `/catalog` + `./create`) resolve against pathnameBase `/catalog` rather
   * than treating the last segment as a file name. Framework mounts already
   * contain the selected base and decoded params, including optional and
   * encoded paths; only isolated mounts require library matching.
   */
  function matchMount(
    normalized: string,
    pathname: string,
    mount?: PageMount,
  ): AdapterPathMatch | null {
    if (mount?.contributesPath !== undefined) {
      // The framework already selected this branch and decoded its params.
      // Only the splat tail belongs to the library projection.
      if (
        pathname !== mount.basePath &&
        !isAncestorBase(mount.basePath, pathname)
      ) {
        return null;
      }
      const tail = pathname.slice(
        mount.basePath === '/' ? 0 : mount.basePath.length,
      );
      return {
        pathname,
        pathnameBase: mount.basePath,
        params: {
          ...mount.params,
          ...matchPath('*', tail || '/', true)?.params,
        },
        pattern: {
          path: normalized.endsWith('/*')
            ? normalized
            : `${normalized === '/' ? '' : normalized}/*`,
        },
      };
    }
    for (const concretePattern of expandOptionalSegments(normalized)) {
      let splatPattern = concretePattern;
      if (!concretePattern.endsWith('/*')) {
        splatPattern = concretePattern === '/' ? '/*' : `${concretePattern}/*`;
      }
      const match =
        bindings.matchPath({ path: splatPattern, end: false }, pathname) ??
        bindings.matchPath({ path: concretePattern, end: false }, pathname);
      if (match) {
        return match;
      }
    }
    return null;
  }

  function toRouteMatch(
    match: AdapterPathMatch,
    id: string,
    mount?: PageMount,
  ) {
    return {
      params: match.params,
      pathname: match.pathname,
      pathnameBase: match.pathnameBase,
      route: {
        path: mount?.contributesPath === false ? '' : match.pattern.path,
        [projectedMountSymbol]: mount,
        caseSensitive: false,
        children: undefined,
        element: null,
        index: false,
        id,
      },
    };
  }

  /**
   * The matches for the framework's own record of the mounts this router is
   * nested inside — the page above a sub-page.
   *
   * Each is projected exactly the way the leaf is, from the mount's pattern and
   * the same location, so an ancestor stands for the same match its own adapter
   * publishes. A mount the location has already left contributes nothing rather
   * than a guess.
   */
  function projectAncestorMounts(
    mountChain: readonly PageMount[],
    pathname: string,
  ): any[] {
    const matches: any[] = [];
    for (const mount of mountChain) {
      const match = matchMount(
        normalizePattern(mount.routePattern),
        pathname,
        mount,
      );
      if (match) {
        matches.push(toRouteMatch(match, `page-${matches.length}`, mount));
      }
    }
    return matches;
  }

  function buildRouteMatches(
    location: AdapterLocation,
    parentMatches: readonly any[],
    mountChain: readonly PageMount[],
  ) {
    // At app root scope there is no route to be mounted under, so there is
    // never a match to project.
    if (normalizedPattern === undefined) {
      return EMPTY_ROUTE_CONTEXT;
    }

    const lastMount = mountChain[mountChain.length - 1];
    const currentMount =
      lastMount &&
      normalizePattern(lastMount.routePattern) === normalizedPattern
        ? lastMount
        : undefined;
    const match = matchMount(
      normalizedPattern,
      location.pathname,
      currentMount,
    );

    // A location outside the page's own pattern only happens while the app is
    // navigating away, i.e. for the render just before this page unmounts. A
    // real router would not have rendered the page at all, so the neutral
    // no-route context is the honest answer — inventing a match here is what
    // makes a stale prefix leak back out through relative navigation.
    if (!match) {
      return EMPTY_ROUTE_CONTEXT;
    }

    // A mount inside an existing route tree is one level *deeper* than that
    // tree, not a fresh root: `..` means "up one route match", so publishing a
    // single match would make the first `..` land at the app root instead of at
    // the parent mount.
    //
    // The surrounding library context answers that when it has something above
    // this mount to say — those are the real matches React Router produced for
    // the same location, layout routes and all. It is silent whenever the page
    // above chose another routing library, which is why it cannot be the only
    // source: the nesting is the framework's, and a relative target must not
    // change meaning because the page above swapped adapters. The framework's
    // own chain of mounts answers for those cases, projected the same way.
    const ancestorMounts = currentMount
      ? mountChain.slice(0, -1)
      : mountChain.filter(mount =>
          isAncestorBase(mount.basePath, match.pathnameBase),
        );
    const ancestors = takeAncestorMatches(
      parentMatches,
      match.pathnameBase,
      ancestorMounts,
    );
    return {
      outlet: null,
      matches: [
        ...(ancestors.length > 0
          ? ancestors
          : projectAncestorMounts(ancestorMounts, location.pathname)),
        toRouteMatch(match, 'page', currentMount),
      ] as any[],
      isDataRoute: false,
    };
  }

  function AppHistoryRouter({ children }: { children: ReactNode }) {
    const location = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    // The route context this router is mounted inside, if any — the parent
    // page's own projection plus whatever routes it matched on the way down to
    // this mount, or the neutral empty context at app root scope.
    const parentMatches = (
      unwrapReactRouterContext(useContext(bindings.UNSAFE_RouteContext)) as
        | { matches?: readonly any[] }
        | null
        | undefined
    )?.matches;
    // React Router builds a fresh RouteContext value on every render of the
    // enclosing `<Routes>`, so the array identity is not usable as a memo key.
    // Key on the parts of those matches this projection carries forward
    // instead, the same way React Router's own `useResolvedPath` keys on its
    // route pathnames.
    const parentMatchesKey = JSON.stringify(
      parentMatches?.map(each => [
        each?.pathname,
        each?.pathnameBase,
        each?.route?.path,
      ]) ?? [],
    );
    // The framework's own record of the mounts above this one, for the mounts
    // whose adapters do not publish this library's route context at all.
    const mountChain = usePageMountChain();

    const locationContextValue = useMemo(
      () =>
        observeReactRouterContext(
          {
            location,
            navigationType: toNavigationType(
              bindings,
              // A history without the metadata capability never tells us how it
              // arrived, and `POP` is what React Router reports for a location it
              // did not itself push or replace.
              latestMetadata?.action ?? 'POP',
            ),
          },
          onUse,
        ),
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
          appHistory.navigate(delta);
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
      // latestLocation / appHistory / options are stable for this router
      // instance
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    const navigationContextValue = useMemo(
      () =>
        observeReactRouterContext(
          {
            basename: '',
            navigator,
            static: false,
            ...navigationContextExtras,
          },
          onUse,
        ),
      [navigator],
    );

    const routeContextValue = useMemo(
      () =>
        observeReactRouterContext(
          buildRouteMatches(location, parentMatches ?? [], mountChain),
          onUse,
        ),
      // `parentMatchesKey` stands in for `parentMatches`, see above.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [location, parentMatchesKey, mountChain],
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

  return { Router: AppHistoryRouter };
}

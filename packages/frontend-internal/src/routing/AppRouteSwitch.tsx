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
  Component,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ComponentType,
  type ErrorInfo,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  createVersionedContext,
  createVersionedValueMap,
} from '@backstage/version-bridge';
import type { AppHistoryApi } from '@backstage/frontend-plugin-api';
import { PageMountProvider, type PageMount } from './PageMountContext';
import { RouteTable, type RouteTableSubPageMatch } from './RouteTable';
import { generatePath, matchPath } from './routePattern';

interface PluginErrorBoundaryProps {
  basePath: string;
  children: ReactNode;
  fallback: ReactElement;
}

interface PluginErrorBoundaryState {
  /** The concrete mount the rest of this state belongs to. */
  basePath: string;
  hasError: boolean;
  error?: Error;
}

/**
 * Renders the app fallback in place of a page that crashed.
 *
 * A crash belongs to the concrete mount it happened at, not to the route
 * pattern: entity A crashing says nothing about entity B, even though both
 * match `/catalog/:namespace/:kind/:name`. The error is therefore cleared
 * whenever the mount changes.
 *
 * Deliberately done through derived state rather than by keying the boundary
 * on the base path. A key would remount the whole page subtree on every base
 * path change, discarding page state, scroll position and in-flight requests
 * for healthy navigation between two entities. Clearing the error instead
 * leaves those renders mount-stable.
 */
class PluginErrorBoundary extends Component<
  PluginErrorBoundaryProps,
  PluginErrorBoundaryState
> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  static getDerivedStateFromProps(
    props: PluginErrorBoundaryProps,
    state: PluginErrorBoundaryState,
  ): Partial<PluginErrorBoundaryState> | null {
    if (state.basePath === props.basePath) {
      return null;
    }
    // A different concrete mount, so any error from the previous one is stale.
    return { basePath: props.basePath, hasError: false, error: undefined };
  }

  state = {
    basePath: this.props.basePath,
    hasError: false,
    error: undefined,
  };

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(
      `[AppRouteSwitch] Plugin at "${this.props.basePath}" crashed:`,
      error,
      info,
    );
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * Which of the matched page's sub-pages the current location selects.
 *
 * The object being present at all means the page is being routed by
 * {@link AppRouteSwitch}. `selected` being absent means the location picked
 * none of the page's sub-pages — the page's own root, or a path below the page
 * that no sub-page claims.
 */
export interface SubPageSelection {
  selected?: {
    /** The sub-page path exactly as registered, e.g. `overview`. */
    path: string;
    /** The sub-page's own mount, for its content and its adapter. */
    mount: PageMount;
  };
}

/**
 * Carries the sub-page half of the current route match down to the page that
 * owns those sub-pages.
 *
 * Versioned for the same reason `page-mount-context` is: `@internal/frontend`
 * is an inline package, so provider and consumer can be compiled from
 * different vintages of this module while sharing one context object through
 * the global singleton. See `PageMountContext` for the full reasoning.
 */
const SubPageSelectionContext = createVersionedContext<{
  1: SubPageSelection;
}>('sub-page-selection-context');

/**
 * Provides the sub-page selection that {@link useSubPageSelection} reads.
 *
 * Memoized on the match's fields rather than its object identity, since page
 * matching builds a fresh match on every location change.
 */
export function SubPageSelectionProvider(props: {
  subPage: RouteTableSubPageMatch | undefined;
  children: ReactNode;
}) {
  const { path, routePattern, basePath } = props.subPage ?? {};

  const versionedValue = useMemo(
    () =>
      createVersionedValueMap({
        1: {
          selected:
            path === undefined ||
            routePattern === undefined ||
            basePath === undefined
              ? undefined
              : { path, mount: { basePath, routePattern } },
        },
      }),
    [path, routePattern, basePath],
  );

  return (
    <SubPageSelectionContext.Provider value={versionedValue}>
      {props.children}
    </SubPageSelectionContext.Provider>
  );
}

/**
 * Returns which sub-page of the surrounding page the current location selects,
 * or `undefined` when the page is not being routed by {@link AppRouteSwitch}
 * (e.g. an isolated `renderInTestApp`).
 */
export function useSubPageSelection(): SubPageSelection | undefined {
  return useContext(SubPageSelectionContext)?.atVersion(1);
}

/**
 * A configured redirect applied by {@link AppRouteSwitch} before page matching.
 */
export interface AppRouteRedirect {
  /** App-absolute path pattern to match. */
  from: string;
  /** Target path; may include `:param` and `*` substitutions from `from`. */
  to: string;
}

/**
 * Properties for {@link AppRouteSwitch}.
 */
export interface AppRouteSwitchProps {
  /** Framework app history that owns browser history. */
  history: AppHistoryApi;
  /** Longest-prefix matcher for registered page paths. */
  routeTable: RouteTable;
  /** Page components keyed by registered route pattern. */
  pages: Map<string, ComponentType>;
  /** Optional redirects resolved before page matching. */
  redirects?: AppRouteRedirect[];
  /** Rendered when no page matches. */
  fallback: ReactElement;
}

/**
 * Match a configured redirect `from` pattern against the current pathname.
 * Root `/` is exact-only; other patterns match exactly or as a prefix with
 * the remainder captured as the splat param (mirroring former useRoutes
 * `from/*` behavior).
 */
function matchRedirect(
  from: string,
  pathname: string,
): Record<string, string> | null {
  if (from === '/') {
    return pathname === '/' ? {} : null;
  }

  const normalizedFrom = from.replace(/\/$/, '') || '/';

  const exact = matchPath(normalizedFrom, pathname, true);
  if (exact) {
    return { ...exact.params, '*': exact.params['*'] ?? '' };
  }

  const partial = matchPath(normalizedFrom, pathname, false);
  if (partial) {
    const rest = pathname
      .slice(partial.matchedPathname.length)
      .replace(/^\//, '');
    return { ...partial.params, '*': rest };
  }

  return null;
}

function resolveRedirectTarget(
  redirects: AppRouteRedirect[] | undefined,
  location: { pathname: string; search: string; hash: string },
): string | undefined {
  if (!redirects?.length) {
    return undefined;
  }
  for (const redirect of redirects) {
    const params = matchRedirect(redirect.from, location.pathname);
    if (params) {
      const template = new URL(redirect.to, 'http://localhost');
      const pathname = generatePath(template.pathname, params);
      // Preserve the incoming search/hash unless the redirect template
      // declares its own.
      const search = template.search || location.search;
      const hash = template.hash || location.hash;
      return `${pathname}${search}${hash}`;
    }
  }
  return undefined;
}

/**
 * Subscribes to AppHistory.location$, matches the current pathname via
 * RouteTable, and renders the matched page extension with a
 * `PageMount` provided via context.
 *
 * Configured redirects are resolved first and applied via
 * `history.navigate(..., { replace: true })` — no react-router `useRoutes`.
 *
 * Reads from AppHistory.location$ (basename-stripped) rather than
 * window.location directly, ensuring correct behavior with app basename.
 *
 * The page map is keyed by the registered pattern (`match.path`). The
 * `PageMount` provided to the matched page carries both that pattern
 * and the concrete matched URL prefix (`match.basePath`).
 *
 * A match is a chain — the page, then the sub-page of that page the location
 * selects. The page shell is rendered for the page half, so it stays mounted
 * across a change of sub-page, while the sub-page half is published separately
 * for the content inside that shell to pick up (see
 * {@link useSubPageSelection}). No routing library is involved on either side.
 *
 * The error boundary is keyed by the pattern, so switching pages remounts it,
 * while navigation between two concrete mounts of the same pattern does not.
 * See {@link PluginErrorBoundary} for how a crash at one such mount is kept
 * from being inherited by the next.
 */
export function AppRouteSwitch(props: AppRouteSwitchProps) {
  const { history, routeTable, pages, redirects, fallback } = props;

  // `history.location` is a stable reference that only changes when the
  // location does, so it is the `useSyncExternalStore` snapshot directly.
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const subscription = history.location$.subscribe(() => onStoreChange());
      return () => subscription.unsubscribe();
    },
    [history],
  );
  const getSnapshot = useCallback(() => history.location, [history]);
  const location = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const redirectTarget = resolveRedirectTarget(redirects, location);

  const match = redirectTarget
    ? undefined
    : routeTable.match(location.pathname);
  const matchedPath = match?.path;
  const matchedBasePath = match?.basePath;

  // A page composed from sub-pages has nothing to show at its own root, so the
  // match names the sub-page to land on instead. Query and hash come along, the
  // same way a configured redirect carries them.
  const indexTarget = match?.indexRedirect
    ? `${match.indexRedirect}${location.search}${location.hash}`
    : undefined;
  const navigationTarget = redirectTarget ?? indexTarget;

  useEffect(() => {
    if (navigationTarget) {
      history.navigate(navigationTarget, { replace: true });
    }
  }, [history, navigationTarget]);

  if (redirectTarget) {
    return null;
  }

  if (!matchedPath || !matchedBasePath) {
    return fallback;
  }

  const PageComponent = pages.get(matchedPath);
  if (!PageComponent) {
    return fallback;
  }

  const pageMount: PageMount = {
    basePath: matchedBasePath,
    routePattern: matchedPath,
  };

  return (
    <PageMountProvider mount={pageMount}>
      <SubPageSelectionProvider subPage={match?.subPage}>
        <PluginErrorBoundary
          key={matchedPath}
          basePath={matchedBasePath}
          fallback={fallback}
        >
          <PageComponent />
        </PluginErrorBoundary>
      </SubPageSelectionProvider>
    </PageMountProvider>
  );
}

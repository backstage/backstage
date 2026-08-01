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
  useEffect,
  useSyncExternalStore,
  type ComponentType,
  type ErrorInfo,
  type ReactElement,
  type ReactNode,
} from 'react';
import type { AppHistoryApi } from '@backstage/frontend-plugin-api';
import { PageMountProvider, type PageMount } from './PageMountContext';
import { RouteTable } from './RouteTable';
import { matchPath, substitutePathParams } from './routePattern';

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
      const substituted = substitutePathParams(redirect.to, params);
      // Preserve the incoming search/hash unless the redirect template
      // declares its own.
      const url = new URL(substituted, 'http://localhost');
      const search = url.search || location.search;
      const hash = url.hash || location.hash;
      return `${url.pathname}${search}${hash}`;
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

  useEffect(() => {
    if (redirectTarget) {
      history.navigate(redirectTarget, { replace: true });
    }
  }, [history, redirectTarget]);

  const match = redirectTarget
    ? undefined
    : routeTable.match(location.pathname);
  const matchedPath = match?.path;
  const matchedBasePath = match?.basePath;

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
      <PluginErrorBoundary
        key={matchedPath}
        basePath={matchedBasePath}
        fallback={fallback}
      >
        <PageComponent />
      </PluginErrorBoundary>
    </PageMountProvider>
  );
}

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
  useEffect,
  type ComponentType,
  type ErrorInfo,
  type ReactElement,
  type ReactNode,
} from 'react';
import { PageMountContext, type PageMount } from '@internal/frontend';
import type { AppHistoryApi } from './AppHistoryApi';
import { RouteTable } from './RouteTable';
import {
  useObservableAsState,
  frameworkLocationEqual,
} from './useObservableAsState';
import { matchPath, substitutePathParams } from './routePattern';

class PluginErrorBoundary extends Component<
  { basePath: string; children: ReactNode; fallback: ReactElement },
  { hasError: boolean; error?: Error }
> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  state = { hasError: false, error: undefined };

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
 *
 * @public
 */
export interface AppRouteRedirect {
  /** App-absolute path pattern to match. */
  from: string;
  /** Target path; may include `:param` and `*` substitutions from `from`. */
  to: string;
}

/**
 * Properties for {@link AppRouteSwitch}.
 *
 * @public
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
 * @public
 */
export function AppRouteSwitch(props: AppRouteSwitchProps) {
  const { history, routeTable, pages, redirects, fallback } = props;

  const location = useObservableAsState(
    history.location$,
    frameworkLocationEqual,
  );

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
    <PageMountContext.Provider value={pageMount}>
      <PluginErrorBoundary
        key={matchedPath}
        basePath={matchedBasePath}
        fallback={fallback}
      >
        <PageComponent />
      </PluginErrorBoundary>
    </PageMountContext.Provider>
  );
}

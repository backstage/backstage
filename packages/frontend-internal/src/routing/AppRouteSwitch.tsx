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
import type { AppHistoryApi } from '@backstage/frontend-plugin-api';
import { AppNodeRouteProvider, useAppRouteMatches } from './PageMountContext';
import { useAppHistoryLocation } from './useAppHistoryLocation';
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
  /** Page components keyed by extension node ID. */
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
 * Renders the first app route in the selected extension branch. Its parent
 * extensions keep responsibility for rendering their own children.
 */
export function AppRouteSwitch(props: AppRouteSwitchProps) {
  const { history, pages, redirects, fallback } = props;
  const location = useAppHistoryLocation(history)!;
  const matches = useAppRouteMatches();
  const match = matches?.find(candidate => pages.has(candidate.node.spec.id));
  const redirectTarget = resolveRedirectTarget(redirects, location);

  useEffect(() => {
    if (redirectTarget) {
      history.navigate(redirectTarget, { replace: true });
    }
  }, [history, redirectTarget]);

  if (redirectTarget) {
    return null;
  }
  const PageComponent = match && pages.get(match.node.spec.id);
  if (!match || !PageComponent) {
    return fallback;
  }
  return (
    <AppNodeRouteProvider node={match.node}>
      <PluginErrorBoundary
        key={match.node.spec.id}
        basePath={match.basePath}
        fallback={fallback}
      >
        <PageComponent />
      </PluginErrorBoundary>
    </AppNodeRouteProvider>
  );
}

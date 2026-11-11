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
import type {
  AppHistoryApi,
  RouteResolutionMatch,
} from '@backstage/frontend-plugin-api';
import { useAppHistoryLocation } from './useAppHistoryLocation';
import {
  expandOptionalSegments,
  matchPath,
  routePriority,
} from './routePattern';
import { parsePath } from './AppRouting';

interface PluginErrorBoundaryProps {
  match: RouteResolutionMatch;
  children: ReactNode;
  errorFallback: AppRouteSwitchProps['errorFallback'];
}

interface PluginErrorBoundaryState {
  /** The concrete mount the rest of this state belongs to. */
  basePath: string;
  hasError: boolean;
  error?: Error;
}

/**
 * Renders the app error display in place of a page that crashed.
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
    if (state.basePath === props.match.basePath) {
      return null;
    }
    // A different concrete mount, so any error from the previous one is stale.
    return {
      basePath: props.match.basePath,
      hasError: false,
      error: undefined,
    };
  }

  state: PluginErrorBoundaryState = {
    basePath: this.props.match.basePath,
    hasError: false,
    error: undefined,
  };

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(
      `[AppRouteSwitch] Plugin at "${this.props.match.basePath}" crashed:`,
      error,
      info,
    );
  }

  handleErrorReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return this.props.errorFallback({
        error: this.state.error!,
        resetError: this.handleErrorReset,
        match: this.props.match,
      });
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
  /**
   * Target path; `:param` substitutions apply to path, query, and fragment.
   * A trailing path `*` substitutes the unmatched remainder of `from`.
   */
  to: string;
}

/**
 * Properties for {@link AppRouteSwitch}.
 */
export interface AppRouteSwitchProps {
  /** Framework app history that owns browser history. */
  history: AppHistoryApi;
  /** Matched branch supplied by the app route resolution API. */
  matches: readonly RouteResolutionMatch[];
  /** Page components keyed by extension node ID. */
  pages: Map<string, ComponentType>;
  /** Optional redirects resolved before page matching. */
  redirects?: AppRouteRedirect[];
  /** Rendered when no page matches. */
  fallback: ReactElement;
  /** Renders a matched page's error separately from a missing route. */
  errorFallback: (props: {
    error: Error;
    resetError: () => void;
    match: RouteResolutionMatch;
  }) => ReactElement;
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

  return matchPath(`${normalizedFrom}/*`, pathname, true)?.params ?? null;
}

function resolveRedirectTarget(
  redirects: AppRouteRedirect[] | undefined,
  location: { pathname: string; search: string; hash: string },
  pagePattern?: string,
): string | undefined {
  if (!redirects?.length) {
    return undefined;
  }
  // Rank concrete branches like React Router's former `from/*` routes.
  // Stable sorting preserves declaration order for equally specific patterns.
  const candidates = [
    ...redirects,
    ...(pagePattern ? [{ from: pagePattern, to: undefined }] : []),
  ]
    .flatMap(redirect =>
      expandOptionalSegments(redirect.from).map(from => {
        const normalized = from.replace(/\/$/, '') || '/';
        const pattern =
          normalized === '/' || normalized.endsWith('/*')
            ? normalized
            : `${normalized}/*`;
        return { ...redirect, from, priority: routePriority(pattern) };
      }),
    )
    .sort((a, b) => b.priority - a.priority);
  for (const redirect of candidates) {
    const params = matchRedirect(redirect.from, location.pathname);
    if (params) {
      // Pages and redirects share ranking; redirects win equal-pattern ties.
      if (redirect.to === undefined) {
        return undefined;
      }
      const template = parsePath(redirect.to);
      // Redirects are URL templates, not route patterns: embedded parameters,
      // every splat, and authored separators must survive interpolation.
      const substituteParams = (value: string) =>
        value.replace(/:([\w-]+)|\*/g, (placeholder, name) => {
          const param = params[name ?? '*'];
          if (param === undefined) return placeholder;
          return name
            ? encodeURIComponent(param)
            : param.split('/').map(encodeURIComponent).join('/');
        });
      const pathname = substituteParams(template.pathname ?? '/');
      // Omitted components inherit the incoming location verbatim; only
      // components authored on the template are treated as templates.
      const search =
        template.search === undefined
          ? location.search
          : substituteParams(template.search);
      const hash =
        template.hash === undefined
          ? location.hash
          : substituteParams(template.hash);
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
  const { history, matches, pages, redirects, fallback, errorFallback } = props;
  const location = useAppHistoryLocation(history)!;
  const match = matches.find(candidate => pages.has(candidate.node.spec.id));
  const redirectTarget = resolveRedirectTarget(
    redirects,
    location,
    match?.routePattern,
  );

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
    <PluginErrorBoundary
      key={match.node.spec.id}
      match={match}
      errorFallback={errorFallback}
    >
      <PageComponent />
    </PluginErrorBoundary>
  );
}

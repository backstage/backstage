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
  useMemo,
} from 'react';
import {
  RoutingContractContext,
  type NavigationControllerApi,
  type RoutingContract,
} from '@backstage/frontend-plugin-api';
import { RouteTable } from './RouteTable';
import {
  useObservableAsState,
  routingLocationEqual,
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

/** @public */
export interface AppRouteRedirect {
  from: string;
  to: string;
}

/** @public */
export interface AppRouteSwitchProps {
  controller: NavigationControllerApi;
  routeTable: RouteTable;
  pages: Map<string, ComponentType>;
  contracts?: Map<string, RoutingContract>;
  redirects?: AppRouteRedirect[];
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
  pathname: string,
): string | undefined {
  if (!redirects?.length) {
    return undefined;
  }
  for (const redirect of redirects) {
    const params = matchRedirect(redirect.from, pathname);
    if (params) {
      return substitutePathParams(redirect.to, params);
    }
  }
  return undefined;
}

/**
 * Subscribes to NavigationController.location$, matches the current pathname
 * via RouteTable, and renders the matched page extension with a scoped
 * RoutingContract provided via context.
 *
 * Configured redirects are resolved first and applied via
 * `controller.navigate(..., { replace: true })` — no react-router `useRoutes`.
 *
 * Reads from NavigationController.location$ (basename-stripped) rather than
 * window.location directly, ensuring correct behavior with app basename.
 *
 * For parameterized routes, the page map and contracts are keyed by the
 * registered pattern (`match.path`). `createContract` receives the concrete
 * matched URL prefix (`match.basePath`) plus that pattern so `basePath` can
 * project across entity-style navigations without replacing the contract.
 *
 * @public
 */
export function AppRouteSwitch(props: AppRouteSwitchProps) {
  const { controller, routeTable, pages, contracts, redirects, fallback } =
    props;

  const location = useObservableAsState(
    controller.location$,
    routingLocationEqual,
  );

  const redirectTarget = resolveRedirectTarget(redirects, location.pathname);

  useEffect(() => {
    if (redirectTarget) {
      controller.navigate(redirectTarget, { replace: true });
    }
  }, [controller, redirectTarget]);

  const match = redirectTarget
    ? undefined
    : routeTable.match(location.pathname);
  const matchedPath = match?.path;
  const matchedBasePath = match?.basePath;

  // Key contracts by registered pattern only — concrete basePath projects
  // on the stable instance so entity A→B does not dispose scoped adapters.
  const contract = useMemo(() => {
    if (!matchedPath || !matchedBasePath) {
      return undefined;
    }
    // Use pre-created contract if available (keyed by registered pattern)
    if (contracts?.has(matchedPath)) {
      return contracts.get(matchedPath)!;
    }
    return controller.createContract(matchedBasePath, {
      routePattern: matchedPath,
    });
    // matchedBasePath intentionally omitted: pattern-keyed identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchedPath, controller, contracts]);

  if (redirectTarget) {
    return null;
  }

  if (!matchedPath || !matchedBasePath || !contract) {
    return fallback;
  }

  const PageComponent = pages.get(matchedPath);
  if (!PageComponent) {
    return fallback;
  }

  return (
    <RoutingContractContext.Provider value={contract}>
      <PluginErrorBoundary
        key={matchedPath}
        basePath={matchedBasePath}
        fallback={fallback}
      >
        <PageComponent />
      </PluginErrorBoundary>
    </RoutingContractContext.Provider>
  );
}

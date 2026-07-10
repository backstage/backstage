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

/**
 * Scoped routing contract factory. Owns createContract scope logic;
 * {@link NavigationController} owns history and delegates here.
 *
 * @internal
 */

import type {
  RoutingBlocker,
  RoutingContract,
  RoutingLocation,
  RoutingNavigateOptions,
} from '@backstage/frontend-plugin-api';
import type { Observable, Subscription } from '@backstage/types';
import { joinPaths } from './joinPaths';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { matchPath } from '../../../frontend-plugin-api/src/routing/routePattern';

type LocationHandler = (location: RoutingLocation) => void;

/**
 * Empty scoped location emitted when a contract has never been in scope.
 * Pathname `'/'` is the scoped root (not the app root); search/hash are empty.
 */
const OUT_OF_SCOPE_SENTINEL: RoutingLocation = {
  pathname: '/',
  search: '',
  hash: '',
  // History API uses null for "no state"; prefer undefined in our own types.
  state: undefined,
};

/** @internal */
export interface ScopedRoutingHost {
  getLocation(): RoutingLocation;
  navigate(to: string, options?: RoutingNavigateOptions): void;
  go(delta: number): void;
  canGoBack(): boolean;
  canGoForward(): boolean;
  readonly historyLength: number;
  getAdapterState(adapterId: string): unknown;
  addSubscriber(handler: LocationHandler): void;
  removeSubscriber(handler: LocationHandler): void;
  block(blocker: RoutingBlocker): () => void;
}

/** @internal */
export interface CreateScopedContractOptions {
  /**
   * Registered route pattern for this contract (e.g.
   * `/catalog/:namespace/:kind/:name`). When it contains dynamic segments,
   * {@link RoutingContract.basePath} projects from the current location so
   * the same contract instance stays valid across concrete prefix changes.
   *
   * Defaults to `basePath` (static mount).
   */
  routePattern?: string;
}

/**
 * Resolve the concrete URL prefix for a route pattern against a pathname.
 * Returns undefined when the pathname is outside the pattern.
 */
function matchConcreteBasePath(
  routePattern: string,
  pathname: string,
): string | undefined {
  if (routePattern === '/') {
    return '/';
  }

  const match = matchPath(routePattern, pathname, false);
  return match?.matchedPathname;
}

/**
 * Create a scoped {@link RoutingContract} for a concrete URL prefix, optionally
 * keyed by a registered route pattern for stable identity across entity-style
 * basePath changes.
 *
 * `basePath` is the initial concrete URL prefix (e.g. `/catalog` or
 * `/catalog/default/component/foo`). When `routePattern` includes dynamic
 * segments, `contract.basePath` is projected from the current location on each
 * read so adapters can keep a single contract instance.
 *
 * @internal
 */
export function createScopedContract(
  host: ScopedRoutingHost,
  basePath: string,
  options?: CreateScopedContractOptions,
): RoutingContract {
  const routePattern = options?.routePattern ?? basePath;
  let lastBasePath = basePath;
  let lastInScope: RoutingLocation = OUT_OF_SCOPE_SENTINEL;

  const resolveBasePath = (pathname: string): string | undefined => {
    return matchConcreteBasePath(routePattern, pathname);
  };

  const currentBasePath = (): string => {
    const matched = resolveBasePath(host.getLocation().pathname);
    if (matched) {
      lastBasePath = matched;
      return matched;
    }
    return lastBasePath;
  };

  const toScoped = (loc: RoutingLocation): RoutingLocation | undefined => {
    const concrete = resolveBasePath(loc.pathname);
    if (!concrete) {
      return undefined;
    }
    lastBasePath = concrete;

    const isRoot = concrete === '/';
    const scopedPathname = isRoot
      ? loc.pathname
      : loc.pathname.slice(concrete.length) || '/';
    return {
      pathname: scopedPathname,
      search: loc.search,
      hash: loc.hash,
      state: loc.state ?? undefined,
    };
  };

  // Seed last-in-scope from the current location when already in scope
  const initialScoped = toScoped(host.getLocation());
  if (initialScoped) {
    lastInScope = initialScoped;
  }

  const contractLocation$: Observable<RoutingLocation> = {
    subscribe: (
      observerOrOnNext?:
        | { next?: (value: RoutingLocation) => void }
        | ((value: RoutingLocation) => void),
      _onError?: (error: Error) => void,
      _onComplete?: () => void,
    ): Subscription => {
      let isClosed = false;
      const onNext =
        typeof observerOrOnNext === 'function'
          ? observerOrOnNext
          : observerOrOnNext?.next?.bind(observerOrOnNext);

      const handler: LocationHandler = (loc: RoutingLocation) => {
        if (isClosed || !onNext) {
          return;
        }

        const scoped = toScoped(loc);
        if (scoped) {
          lastInScope = scoped;
          onNext(scoped);
        }
        // Out of scope: do not emit on subsequent location changes.
        // Sync emission on subscribe still delivers lastInScope / sentinel.
      };

      host.addSubscriber(handler);

      // Always emit synchronously on subscribe — either the current
      // in-scope location or the last-in-scope / empty sentinel.
      const currentScoped = toScoped(host.getLocation());
      if (currentScoped) {
        lastInScope = currentScoped;
        onNext?.(currentScoped);
      } else {
        onNext?.(lastInScope);
      }

      return {
        unsubscribe: () => {
          isClosed = true;
          host.removeSubscriber(handler);
        },
        get closed() {
          return isClosed;
        },
      };
    },
    [Symbol.observable]() {
      return this;
    },
  };

  return {
    get basePath() {
      return currentBasePath();
    },
    routePattern,
    location$: contractLocation$,
    navigate: (to: string, navigateOptions?: RoutingNavigateOptions): void => {
      if (to.startsWith('//') || to.includes('://')) {
        throw new Error(
          'RoutingContract.navigate does not support absolute or protocol-relative URLs',
        );
      }

      const scopeBase = currentBasePath();

      // Join basePath + to with proper slash handling, then normalize
      let joined: string;
      if (scopeBase === '/') {
        joined = to.startsWith('/') ? to : `/${to}`;
      } else {
        joined = joinPaths(scopeBase, to);
      }
      const resolvedUrl = new URL(joined, 'http://localhost');
      const resolvedPath = resolvedUrl.pathname;

      // Check if the resolved path is within the basePath scope
      const isRoot = scopeBase === '/';
      if (
        !isRoot &&
        resolvedPath !== scopeBase &&
        !resolvedPath.startsWith(`${scopeBase}/`)
      ) {
        // eslint-disable-next-line no-console
        console.warn(
          `[ScopedRouting] Contract navigate called with path "${to}" ` +
            `that resolves outside basePath "${scopeBase}". Navigation blocked. ` +
            `For cross-plugin navigation, use framework navigation via ` +
            `navigationControllerApiRef instead of a plugin-local navigate.`,
        );
        return;
      }

      host.navigate(
        resolvedPath + resolvedUrl.search + resolvedUrl.hash,
        navigateOptions,
      );
    },
    go: (delta: number) => host.go(delta),
    canGoBack: () => host.canGoBack(),
    canGoForward: () => host.canGoForward(),
    get historyLength() {
      return host.historyLength;
    },
    getAdapterState: (adapterId: string) => host.getAdapterState(adapterId),
    // Blockers are shared with chrome/framework navigation and every other
    // adapter, not scoped to this contract's basePath.
    block: (blocker: RoutingBlocker) => host.block(blocker),
  };
}

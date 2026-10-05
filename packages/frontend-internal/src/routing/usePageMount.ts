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

import { useCallback, useMemo } from 'react';
import type {
  ApiHolder,
  AppNode,
  RouteResolutionMatch,
} from '@backstage/frontend-plugin-api';
import { useVersionedContext } from '@backstage/version-bridge';
import { appHistoryApiRef, routeResolutionApiRef } from './routingApiRefs';
import { useAppHistoryLocation } from './useAppHistoryLocation';

/** Routing information used by first-party adapters, including isolated tests. */
export type PageMount = Pick<
  RouteResolutionMatch,
  'basePath' | 'routePattern'
> &
  Partial<Pick<RouteResolutionMatch, 'params' | 'contributesPath'>>;

// These hooks read the existing node and API contexts directly because this
// module is inlined into frontend-plugin-api and cannot import its runtime.
const EMPTY_CHAIN: readonly RouteResolutionMatch[] = Object.freeze([]);

/** Returns routing scope from the current app node and the app's route resolver. */
export function usePageMountChain(): readonly RouteResolutionMatch[] {
  const node = useVersionedContext<{ 1: { node?: AppNode } }>(
    'app-node-context',
  )?.atVersion(1)?.node;
  const apis = useVersionedContext<{ 1: ApiHolder }>('api-context')?.atVersion(
    1,
  );
  const location = useAppHistoryLocation(apis?.get(appHistoryApiRef));
  const routes = apis?.get(routeResolutionApiRef);
  return node && routes
    ? routes.resolvePath({ pathname: location?.pathname ?? '/', node }).matches
    : EMPTY_CHAIN;
}

/** Returns the closest matched route-bearing ancestor of the current app node. */
export function usePageMount(): RouteResolutionMatch | undefined {
  return usePageMountChain().at(-1);
}

/** Resolves this mount at an explicit pathname, independently of React commits. */
export function usePageMountResolver():
  | ((pathname: string) => PageMount | undefined)
  | undefined {
  const node = usePageMount()?.node;
  const routes = useVersionedContext<{ 1: ApiHolder }>('api-context')
    ?.atVersion(1)
    ?.get(routeResolutionApiRef);
  const resolve = useCallback(
    (pathname: string) => {
      const match = routes?.resolvePath({ pathname, node }).matches.at(-1);
      return match?.node === node ? match : undefined;
    },
    [routes, node],
  );
  return routes && node ? resolve : undefined;
}

/** Path-contributing ancestors, for route-relative navigation. */
export function usePageMountBasePaths(): string[] {
  const chain = usePageMountChain();
  return useMemo(
    () =>
      chain
        .filter(
          (mount, index) => index === 0 || mount.contributesPath !== false,
        )
        .map(mount => mount.basePath),
    [chain],
  );
}

/** Returns the selected app branch, regardless of the consuming node's scope. */
export function useAppRouteMatches():
  | readonly RouteResolutionMatch[]
  | undefined {
  const apis = useVersionedContext<{ 1: ApiHolder }>('api-context')?.atVersion(
    1,
  );
  const location = useAppHistoryLocation(apis?.get(appHistoryApiRef));
  return apis
    ?.get(routeResolutionApiRef)
    ?.resolvePath({ pathname: location?.pathname ?? '/' }).matches;
}

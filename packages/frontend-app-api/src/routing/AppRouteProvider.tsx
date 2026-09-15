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

import { useMemo, type ReactNode } from 'react';
import type { AppHistoryApi, AppNode } from '@backstage/frontend-plugin-api';
import {
  AppRouteMatchesProvider,
  useAppHistoryLocation,
  type PageMount,
} from '@internal/frontend';
import { matchRouteRefs, type RouteRefMatch } from './matchRouteRefs';
import type { BackstageRouteObject } from './types';

function toPageMount(match: RouteRefMatch): PageMount {
  return {
    basePath: match.pathnameBase,
    routePattern: match.routePattern,
    params: match.params,
    contributesPath: match.routeObject.path.length > 0,
  };
}

/** Provides the selected extension branch independently of any router adapter. */
export function AppRouteProvider(props: {
  history: AppHistoryApi;
  routeObjects: BackstageRouteObject[];
  children: ReactNode;
}) {
  const { history, routeObjects, children } = props;
  const location = useAppHistoryLocation(history)!;
  // A resolver belongs to a node in this route tree, not to one location. Its
  // stable identity lets adapters keep their state across optional-path changes.
  const getResolver = useMemo(() => {
    const resolvers = new WeakMap<AppNode, NonNullable<PageMount['resolve']>>();
    return (node: AppNode) => {
      let resolve = resolvers.get(node);
      if (!resolve) {
        resolve = pathname => {
          const next = matchRouteRefs(routeObjects, pathname)?.find(
            candidate => candidate.routeObject.appNode === node,
          );
          return next ? toPageMount(next) : undefined;
        };
        resolvers.set(node, resolve);
      }
      return resolve;
    };
  }, [routeObjects]);
  const matches = useMemo(
    () =>
      (matchRouteRefs(routeObjects, location.pathname) ?? []).flatMap(match => {
        const node = match.routeObject.appNode;
        if (!node) {
          return [];
        }
        return [{ ...toPageMount(match), node, resolve: getResolver(node) }];
      }),
    [routeObjects, location.pathname, getResolver],
  );
  return (
    <AppRouteMatchesProvider matches={matches}>
      {children}
    </AppRouteMatchesProvider>
  );
}

/*
 * Copyright 2025 The Backstage Authors
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

import { RouteRef } from '@backstage/frontend-plugin-api';
import { RouteRefsById } from './collectRouteIds';
import { OpaqueRouteRef } from '@internal/frontend';

/**
 * @internal
 */
export type RouteAliasResolver = {
  (routeRef: RouteRef, pluginId?: string): RouteRef;
  (routeRef?: RouteRef, pluginId?: string): RouteRef | undefined;
};

/**
 * Creates a route alias resolver that resolves aliases based on the route IDs
 * @internal
 */
export function createRouteAliasResolver(
  routeRefsById: RouteRefsById,
): RouteAliasResolver {
  const resolver = (routeRef: RouteRef | undefined, pluginId?: string) => {
    if (!routeRef) {
      return undefined;
    }

    let currentRef = routeRef;
    for (let i = 0; i < 100; i++) {
      const alias = OpaqueRouteRef.toInternal(currentRef).alias;
      if (alias) {
        if (pluginId) {
          const [aliasPluginId] = alias.split('.');
          if (aliasPluginId !== pluginId) {
            throw new Error(
              `Refused to resolve alias '${alias}' for ${currentRef} as it points to a different plugin, the expected plugin is '${pluginId}' but the alias points to '${aliasPluginId}'`,
            );
          }
        }
        const aliasRef = routeRefsById.routes.get(alias);
        if (!aliasRef) {
          throw new Error(
            `Unable to resolve RouteRef alias '${alias}' for ${currentRef}`,
          );
        }
        if (aliasRef.$$type === '@backstage/SubRouteRef') {
          throw new Error(
            `RouteRef alias '${alias}' for ${currentRef} points to a SubRouteRef, which is not supported`,
          );
        }
        currentRef = aliasRef;
      } else {
        return currentRef;
      }
    }
    throw new Error(`Alias loop detected for ${routeRef}`);
  };

  return resolver as RouteAliasResolver;
}

/**
 * Creates a route alias resolver that resolves aliases based on a map of route refs to their aliases
 * @internal
 */
export function createExactRouteAliasResolver(
  routeAliases: Map<RouteRef, RouteRef | undefined>,
): RouteAliasResolver {
  const resolver = (routeRef?: RouteRef) => {
    if (routeRef && routeAliases.has(routeRef)) {
      return routeAliases.get(routeRef);
    }
    return routeRef;
  };
  return resolver as RouteAliasResolver;
}

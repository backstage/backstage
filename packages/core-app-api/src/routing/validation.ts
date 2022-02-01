/*
 * Copyright 2020 The Backstage Authors
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
  BackstagePlugin,
  ExternalRouteRef,
  RouteRef,
  SubRouteRef,
} from '@backstage/core-plugin-api';
import { AnyRouteRef } from './types';

// Validates that there is no duplication of route parameter names
export function validateRouteParameters(
  routePaths: Map<AnyRouteRef, string>,
  routeParents: Map<AnyRouteRef, AnyRouteRef | undefined>,
) {
  const notLeafRoutes = new Set(routeParents.values());
  notLeafRoutes.delete(undefined);

  for (const route of routeParents.keys()) {
    if (notLeafRoutes.has(route)) {
      continue;
    }

    let currentRouteRef: AnyRouteRef | undefined = route;

    let fullPath = '';
    while (currentRouteRef) {
      const path = routePaths.get(currentRouteRef);
      if (!path) {
        throw new Error(`No path for ${currentRouteRef}`);
      }
      fullPath = `${path}${fullPath}`;
      currentRouteRef = routeParents.get(currentRouteRef);
    }

    const params = fullPath.match(/:(\w+)/g);
    if (params) {
      for (let j = 0; j < params.length; j++) {
        for (let i = j + 1; i < params.length; i++) {
          if (params[i] === params[j]) {
            throw new Error(
              `Parameter ${params[i]} is duplicated in path ${fullPath}`,
            );
          }
        }
      }
    }
  }
}

// Validates that all non-optional external routes have been bound
export function validateRouteBindings(
  routeBindings: Map<ExternalRouteRef, RouteRef | SubRouteRef>,
  plugins: Iterable<BackstagePlugin<{}, Record<string, ExternalRouteRef>>>,
) {
  for (const plugin of plugins) {
    if (!plugin.externalRoutes) {
      continue;
    }

    for (const [name, externalRouteRef] of Object.entries(
      plugin.externalRoutes,
    )) {
      if (externalRouteRef.optional) {
        continue;
      }

      if (!routeBindings.has(externalRouteRef)) {
        throw new Error(
          `External route '${name}' of the '${plugin.getId()}' plugin must be bound to a target route. ` +
            'See https://backstage.io/link?bind-routes for details.',
        );
      }
    }
  }
}

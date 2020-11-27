/*
 * Copyright 2020 Spotify AB
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

import React, { createContext, ReactNode, useContext } from 'react';
import { RouteRef } from './types';
import { generatePath, useParams } from 'react-router-dom';

export type RouteFunc = (params?: Record<string, string>) => string;

class RouteResolver {
  constructor(
    private readonly routes: Map<RouteRef, string>,
    private readonly routeParents: Map<RouteRef, RouteRef | undefined>,
  ) {}

  resolve(routeRef: RouteRef, parentParams: Record<string, string>): RouteFunc {
    let currentRouteRef: RouteRef | undefined = routeRef;
    let fullPath = '';

    while (currentRouteRef) {
      const path = this.routes.get(currentRouteRef);
      if (!path) {
        throw new Error(`No path for ${currentRouteRef}`);
      }
      fullPath = `${path}${fullPath}`;
      currentRouteRef = this.routeParents.get(currentRouteRef);
    }

    return (params?: Record<string, string>) => {
      return generatePath(fullPath, { ...params, ...parentParams });
    };
  }
}

const RoutingContext = createContext<RouteResolver | undefined>(undefined);

export function useRouteRef(routeRef: RouteRef): RouteFunc {
  const resolver = useContext(RoutingContext);
  const params = useParams();
  if (!resolver) {
    throw new Error('No route resolver found in context');
  }

  return resolver.resolve(routeRef, params);
}

type ProviderProps = {
  routes: Map<RouteRef, string>;
  routeParents: Map<RouteRef, RouteRef | undefined>;
  children: ReactNode;
};

export const RoutingProvider = ({
  routes,
  routeParents,
  children,
}: ProviderProps) => {
  const resolver = new RouteResolver(routes, routeParents);
  return (
    <RoutingContext.Provider value={resolver}>
      {children}
    </RoutingContext.Provider>
  );
};

export function validateRoutes(
  routes: Map<RouteRef, string>,
  routeParents: Map<RouteRef, RouteRef | undefined>,
) {
  const notLeafRoutes = new Set(routeParents.values());
  notLeafRoutes.delete(undefined);

  for (const route of routeParents.keys()) {
    if (notLeafRoutes.has(route)) {
      continue;
    }

    let currentRouteRef: RouteRef | undefined = route;

    let fullPath = '';
    while (currentRouteRef) {
      const path = routes.get(currentRouteRef);
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

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

export type RouteFunc = () => string;

class RouteResolver {
  constructor(
    private readonly routes: Map<RouteRef, string>,
    private readonly routeParents: Map<RouteRef, RouteRef | undefined>,
  ) {}

  resolve(routeRef: RouteRef): RouteFunc {
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

    return () => {
      return fullPath;
    };
  }
}

const RoutingContext = createContext<RouteResolver | undefined>(undefined);

export function useRouteRef(routeRef: RouteRef): RouteFunc | undefined {
  const resolver = useContext(RoutingContext);
  if (!resolver) {
    throw new Error('No route resolver found in context');
  }

  return resolver.resolve(routeRef);
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

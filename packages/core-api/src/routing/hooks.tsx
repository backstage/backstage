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

import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  BackstageRouteObject,
  RouteRef,
  ExternalRouteRef,
  AnyParams,
  SubRouteRef,
  RouteFunc,
} from './types';
import { RouteResolver } from './RouteResolver';

const RoutingContext = createContext<RouteResolver | undefined>(undefined);

export function useRouteRef<Optional extends boolean, Params extends AnyParams>(
  routeRef: ExternalRouteRef<Params, Optional>,
): Optional extends true ? RouteFunc<Params> | undefined : RouteFunc<Params>;
export function useRouteRef<Params extends AnyParams>(
  routeRef: RouteRef<Params> | SubRouteRef<Params>,
): RouteFunc<Params>;
export function useRouteRef<Params extends AnyParams>(
  routeRef:
    | RouteRef<Params>
    | SubRouteRef<Params>
    | ExternalRouteRef<Params, any>,
): RouteFunc<Params> | undefined {
  const sourceLocation = useLocation();
  const resolver = useContext(RoutingContext);
  const routeFunc = useMemo(
    () => resolver && resolver.resolve(routeRef, sourceLocation),
    [resolver, routeRef, sourceLocation],
  );

  if (!routeFunc && !resolver) {
    throw new Error('No route resolver found in context');
  }

  const isOptional = 'optional' in routeRef && routeRef.optional;
  if (!routeFunc && !isOptional) {
    throw new Error(`No path for ${routeRef}`);
  }

  return routeFunc;
}

type ProviderProps = {
  routePaths: Map<RouteRef, string>;
  routeParents: Map<RouteRef, RouteRef | undefined>;
  routeObjects: BackstageRouteObject[];
  routeBindings: Map<ExternalRouteRef, RouteRef | SubRouteRef>;
  children: ReactNode;
};

export const RoutingProvider = ({
  routePaths,
  routeParents,
  routeObjects,
  routeBindings,
  children,
}: ProviderProps) => {
  const resolver = new RouteResolver(
    routePaths,
    routeParents,
    routeObjects,
    routeBindings,
  );
  return (
    <RoutingContext.Provider value={resolver}>
      {children}
    </RoutingContext.Provider>
  );
};

/*
 * Copyright 2022 The Backstage Authors
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

import { matchRoutes } from 'react-router-dom';
import { useVersionedContext } from '@backstage/version-bridge';
import {
  AnyParams,
  BackstageRouteObject,
  ExternalRouteRef,
  RouteFunc,
  RouteRef,
  SubRouteRef,
} from './types';

/**
 * @internal
 */
export interface RouteResolver {
  resolve<Params extends AnyParams>(
    anyRouteRef:
      | RouteRef<Params>
      | SubRouteRef<Params>
      | ExternalRouteRef<Params, any>,
    sourceLocation: Parameters<typeof matchRoutes>[1],
  ): RouteFunc<Params> | undefined;

  routePaths: Map<RouteRef, string>;
  routeParents: Map<RouteRef, RouteRef | undefined>;
  routeObjects: BackstageRouteObject[];
}

/**
 * Internal hook for getting the route resolver.
 *
 * @internal
 */
export function useRouteResolver() {
  const versionedContext = useVersionedContext<{ 1: RouteResolver }>(
    'routing-context',
  );
  if (!versionedContext) {
    throw new Error('Routing context is not available');
  }

  const resolver = versionedContext.atVersion(1);
  if (!resolver) {
    throw new Error('RoutingContext v1 not available');
  }

  return resolver;
}

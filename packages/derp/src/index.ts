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

import { useContext, useMemo, Context } from 'react';
import { ExternalRouteRef, RouteRef } from '@backstage/core';
import { useLocation } from 'react-router-dom';
import { getGlobalSingleton } from './globalObject';

type AnyParams = { [param in string]: string } | undefined;
type Query = Record<string, string>;

type RouteFunc<Params extends AnyParams> = (
  ...[params]: Params extends undefined
    ? readonly [params: { query?: Query }] | []
    : readonly [params: { query?: Query; params: Params }]
) => string;

interface RouteResolver {
  resolve<Params extends AnyParams>(
    routeRefOrExternalRouteRef: RouteRef<Params> | ExternalRouteRef<Params>,
    sourceLocation: ReturnType<typeof useLocation>,
  ): RouteFunc<Params> | undefined;
}

type VersionedContext<Types extends { [version: number]: any }> = {
  getVersion<Version extends keyof Types>(version: Version): Types[Version];
};

/*

Elxcercxksize:

Current state: Everything is in core, including
  - components
  - createApp
  - useApp

New State: Things are split
  @backstage/core: (becomes /components)
    - components

  @backstage/app-api:
    - createApp
    * Never includes funcs used by plugins/packages. Add rules to ensure that.

  @backstage/plugin-api:
    - useApp
    - createPlugin?
    - peer dep on 1 || 2 || 3

*/

/*

- We're assuming that the provider that creates the app sets the source of truth
- We're assuming all consumers run after the source of truth is set
  - Providers are always rendered before Consumers
  - getting a component from the app always happens after createApp

*/


const RoutingString = getGlobalSingleton<VersionedContext<{ 1: string; 2: string }>>('routing-string', () =>{
  throw new Error('this should not be run first');
});
console.log('DEBUG: RoutingString 1 =', RoutingString.getValueForASpecificVersion(1))
console.log('DEBUG: RoutingString 1 =', RoutingString.get(1))
console.log('DEBUG: RoutingString 2 =', RoutingString.getVersion(2))
console.log('DEBUG: RoutingString 2 =', RoutingString.for(2))
console.log('DEBUG: RoutingString 2 =', RoutingString.forVersion(2))
console.log('DEBUG: RoutingString 2 =', RoutingString.version(2))
console.log('DEBUG: RoutingString 2 =', Array.from(RoutingString)[1])

// Proxy
console.log('DEBUG: RoutingString 2 =', RoutingString[2])

// RoutingString.observe()
// for(value of RoutingString){

// }

const getRoutingContext = (() => {
  let context: Context<VersionedContext<{2: RouteResolver}>>;

  return (): Context<VersionedContext<{2: RouteResolver}>> => {
    if (context) {
      return context;
    }
    context = getGlobalSingleton('routing-context', () => {
      throw new Error('this should not be run first');
    });
    return context;
  };
})();

export function useRouteRef<Optional extends boolean, Params extends AnyParams>(
  routeRef: ExternalRouteRef<Params, Optional>,
): Optional extends true ? RouteFunc<Params> | undefined : RouteFunc<Params>;
export function useRouteRef<Params extends AnyParams>(
  routeRef: RouteRef<Params>,
): RouteFunc<Params>;
export function useRouteRef<Params extends AnyParams>(
  routeRef: RouteRef<Params> | ExternalRouteRef<Params, any>,
): RouteFunc<Params> | undefined {
  /* hello from derp! */
  const sourceLocation = useLocation();
  const resolver = useContext(getRoutingContext()).getVersion(2);
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

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

import { useMemo } from 'react';
import { matchRoutes, useLocation } from 'react-router-dom';
import { useVersionedContext } from '@backstage/version-bridge';
import { AnyRouteRefParams } from './types';
import { RouteRef } from './RouteRef';
import { SubRouteRef } from './SubRouteRef';
import { ExternalRouteRef } from './ExternalRouteRef';

/**
 * TS magic for handling route parameters.
 *
 * @remarks
 *
 * The extra TS magic here is to require a single params argument if the RouteRef
 * had at least one param defined, but require 0 arguments if there are no params defined.
 * Without this we'd have to pass in empty object to all parameter-less RouteRefs
 * just to make TypeScript happy, or we would have to make the argument optional in
 * which case you might forget to pass it in when it is actually required.
 *
 * @public
 */
export type RouteFunc<TParams extends AnyRouteRefParams> = (
  ...[params]: TParams extends undefined
    ? readonly []
    : readonly [params: TParams]
) => string;

/**
 * @internal
 */
export interface RouteResolver {
  resolve<TParams extends AnyRouteRefParams>(
    anyRouteRef:
      | RouteRef<TParams>
      | SubRouteRef<TParams>
      | ExternalRouteRef<TParams, any>,
    sourceLocation: Parameters<typeof matchRoutes>[1],
  ): RouteFunc<TParams> | undefined;
}

/**
 * React hook for constructing URLs to routes.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}
 *
 * @param routeRef - The ref to route that should be converted to URL.
 * @returns A function that will in turn return the concrete URL of the `routeRef`.
 * @public
 */
export function useRouteRef<
  TOptional extends boolean,
  TParams extends AnyRouteRefParams,
>(
  routeRef: ExternalRouteRef<TParams, TOptional>,
): TParams extends true ? RouteFunc<TParams> | undefined : RouteFunc<TParams>;

/**
 * React hook for constructing URLs to routes.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}
 *
 * @param routeRef - The ref to route that should be converted to URL.
 * @returns A function that will in turn return the concrete URL of the `routeRef`.
 * @public
 */
export function useRouteRef<TParams extends AnyRouteRefParams>(
  routeRef: RouteRef<TParams> | SubRouteRef<TParams>,
): RouteFunc<TParams>;

/**
 * React hook for constructing URLs to routes.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/plugins/composability#routing-system}
 *
 * @param routeRef - The ref to route that should be converted to URL.
 * @returns A function that will in turn return the concrete URL of the `routeRef`.
 * @public
 */
export function useRouteRef<TParams extends AnyRouteRefParams>(
  routeRef:
    | RouteRef<TParams>
    | SubRouteRef<TParams>
    | ExternalRouteRef<TParams, any>,
): RouteFunc<TParams> | undefined {
  const { pathname } = useLocation();
  const versionedContext = useVersionedContext<{ 1: RouteResolver }>(
    'routing-context',
  );
  if (!versionedContext) {
    throw new Error('Routing context is not available');
  }

  const resolver = versionedContext.atVersion(1);
  const routeFunc = useMemo(
    () => resolver && resolver.resolve(routeRef, { pathname }),
    [resolver, routeRef, pathname],
  );

  if (!versionedContext) {
    throw new Error('useRouteRef used outside of routing context');
  }
  if (!resolver) {
    throw new Error('RoutingContext v1 not available');
  }

  const isOptional = 'optional' in routeRef && routeRef.optional;
  if (!routeFunc && !isOptional) {
    throw new Error(`No path for ${routeRef}`);
  }

  return routeFunc;
}

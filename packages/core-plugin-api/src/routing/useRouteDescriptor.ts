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

import { useCallback } from 'react';

import { AnyParams, RouteRef, routeRefType, SubRouteRef } from './types';
import { useRouteResolver } from './useRouteResolver';

/**
 * @public
 */
export interface RoutePart<Complete extends boolean = boolean> {
  routeRef: RouteRef<any> | SubRouteRef<any>;
  segment: Complete extends false ? string | undefined : string;
}

/**
 * @public
 */
export interface RouteDescriptor<Complete extends boolean = boolean> {
  parts: RoutePart<Complete>[];
  matchUrl: Complete extends false ? undefined : string;
  complete: Complete;
}

/**
 * @param routeRef - The ref to route that should be converted to URL.
 * @returns A function that will in turn return the concrete URL of the `routeRef`.
 * @public
 */
export type RouteDescriptorFunc = (
  routeRef: RouteRef<any> | SubRouteRef<any>,
) => RouteDescriptor;

/**
 * React hook for getting a {@link RouteDescriptorFunc} for which to get route
 * descriptions for a routeRef.
 *
 * @returns A {@link RouteDescriptorFunc} function.
 * @public
 */
export function useRouteDescriptor(): RouteDescriptorFunc {
  const resolver = useRouteResolver();

  return useCallback(
    (routeRef: RouteRef<any> | SubRouteRef<any>) =>
      getRouteDescriptor(routeRef, resolver.routeParents, resolver.routePaths),
    [resolver],
  );
}

export function isCompleteRouteDescriptor(
  routeDescriptor: RouteDescriptor<boolean>,
): routeDescriptor is RouteDescriptor<true> {
  return routeDescriptor.complete;
}

// Traverses a routeref parent ancestry to figure out the full parameterized url
function getRouteDescriptor<T extends {}>(
  routeRef: RouteRef<T> | SubRouteRef<T>,
  routeParents: Map<RouteRef<any>, RouteRef<any> | undefined>,
  routePaths: Map<RouteRef<any>, string>,
): RouteDescriptor {
  const recurse = (_routeRef: RouteRef<T> | SubRouteRef<T>): RoutePart[] => {
    if (isAbsoluteRouteRef(_routeRef)) {
      const path = routePaths.get(_routeRef)!;
      const parent = routeParents.get(_routeRef);
      const part: RoutePart = {
        routeRef: _routeRef,
        segment: path === undefined ? undefined : trimSlashes(path),
      };
      return parent ? [...recurse(parent), part] : [part];
    }

    const part: RoutePart = {
      routeRef: _routeRef,
      segment: trimSlashes(_routeRef.path),
    };
    return [...recurse(_routeRef.parent), part];
  };

  const parts = recurse(routeRef);

  const complete = !parts.some(part => part.segment === undefined);

  const matchUrl = !complete
    ? undefined
    : parts
        .map(({ segment }) => segment!.replace(/:[^/]+/g, '([^/]+)'))
        .join('/');

  return { parts, matchUrl, complete };
}

function trimSlashes(path: string): string {
  return path.replace(/^\/+/, '').replace(/\/+$/, '');
}

function isAbsoluteRouteRef<T extends AnyParams = any>(
  routeRef: RouteRef<T> | SubRouteRef<T>,
): routeRef is RouteRef<T> {
  return (routeRef as any)[routeRefType] === 'absolute';
}

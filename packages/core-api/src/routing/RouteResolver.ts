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

import { generatePath, matchRoutes, useLocation } from 'react-router-dom';
import {
  AnyRouteRef,
  BackstageRouteObject,
  RouteRef,
  ExternalRouteRef,
  AnyParams,
  SubRouteRef,
  routeRefType,
  RouteFunc,
} from './types';
import { isRouteRef } from './RouteRef';
import { isSubRouteRef } from './SubRouteRef';
import { isExternalRouteRef } from './ExternalRouteRef';

export class RouteResolver {
  constructor(
    private readonly routePaths: Map<AnyRouteRef, string>,
    private readonly routeParents: Map<AnyRouteRef, AnyRouteRef | undefined>,
    private readonly routeObjects: BackstageRouteObject[],
    private readonly routeBindings: Map<
      ExternalRouteRef,
      RouteRef | SubRouteRef
    >,
  ) {}

  resolve<Params extends AnyParams>(
    anyRouteRef:
      | RouteRef<Params>
      | SubRouteRef<Params>
      | ExternalRouteRef<Params, any>,
    sourceLocation: ReturnType<typeof useLocation>,
  ): RouteFunc<Params> | undefined {
    let resolvedRef: AnyRouteRef;
    let subRoutePath = '';
    if (isRouteRef(anyRouteRef)) {
      resolvedRef = anyRouteRef;
    } else if (isSubRouteRef(anyRouteRef)) {
      resolvedRef = anyRouteRef.parent;
      subRoutePath = anyRouteRef.path;
    } else if (isExternalRouteRef(anyRouteRef)) {
      const resolvedRoute = this.routeBindings.get(anyRouteRef);
      if (!resolvedRoute) {
        return undefined;
      }
      if (isSubRouteRef(resolvedRoute)) {
        subRoutePath = resolvedRoute.path;
        resolvedRef = resolvedRoute.parent;
      } else {
        resolvedRef = resolvedRoute;
      }
    } else if (anyRouteRef[routeRefType]) {
      throw new Error(
        `Unknown or invalid route ref type, ${anyRouteRef[routeRefType]}`,
      );
    } else {
      throw new Error(
        `Unknown object passed to useRouteRef, got ${anyRouteRef}`,
      );
    }

    const match = matchRoutes(this.routeObjects, sourceLocation) ?? [];

    // If our route isn't bound to a path we fail the resolution and let the caller decide the failure mode
    const resolvedPath = this.routePaths.get(resolvedRef);
    if (!resolvedPath) {
      return undefined;
    }
    // SubRouteRefs join the path from the parent route with its own path
    const lastPath =
      resolvedPath +
      (resolvedPath.endsWith('/') ? subRoutePath.slice(1) : subRoutePath);

    const targetRefStack = Array<AnyRouteRef>();
    let matchIndex = -1;

    for (
      let currentRouteRef: AnyRouteRef | undefined = resolvedRef;
      currentRouteRef;
      currentRouteRef = this.routeParents.get(currentRouteRef)
    ) {
      matchIndex = match.findIndex(m =>
        (m.route as BackstageRouteObject).routeRefs.has(currentRouteRef!),
      );
      if (matchIndex !== -1) {
        break;
      }

      targetRefStack.unshift(currentRouteRef);
    }

    // If our target route is present in the initial match we need to construct the final path
    // from the parent of the matched route segment. That's to allow the caller of the route
    // function to supply their own params.
    if (targetRefStack.length === 0) {
      matchIndex -= 1;
    }

    // This is the part of the route tree that the target and source locations have in common.
    // We re-use the existing pathname directly along with all params.
    const parentPath = matchIndex === -1 ? '' : match[matchIndex].pathname;

    // This constructs the mid section of the path using paths resolved from all route refs
    // we need to traverse to reach our target except for the very last one. None of these
    // paths are allowed to require any parameters, as the called would have no way of knowing
    // what parameters those are.
    const prefixPath = targetRefStack
      .slice(0, -1)
      .map(ref => {
        const path = this.routePaths.get(ref);
        if (!path) {
          throw new Error(`No path for ${ref}`);
        }
        if (path.includes(':')) {
          throw new Error(
            `Cannot route to ${resolvedRef} with parent ${ref} as it has parameters`,
          );
        }
        return path;
      })
      .join('/')
      .replace(/\/\/+/g, '/'); // Normalize path to not contain repeated /'s

    const routeFunc: RouteFunc<Params> = (...[params]) => {
      return `${parentPath}${prefixPath}${generatePath(lastPath, params)}`;
    };
    return routeFunc;
  }
}

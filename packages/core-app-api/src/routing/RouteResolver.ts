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

import { generatePath, matchRoutes } from 'react-router-dom';
import {
  AnyRouteRef,
  BackstageRouteObject,
  AnyParams,
  RouteFunc,
  routeRefType,
  isRouteRef,
  isSubRouteRef,
  isExternalRouteRef,
} from './types';
import {
  RouteRef,
  ExternalRouteRef,
  SubRouteRef,
} from '@backstage/core-plugin-api';
import { joinPaths } from './helpers';
import mapValues from 'lodash/mapValues';

/**
 * Resolves the absolute route ref that our target route ref is pointing pointing to, as well
 * as the relative target path.
 *
 * Returns an undefined target ref if one could not be fully resolved.
 */
function resolveTargetRef(
  anyRouteRef: AnyRouteRef,
  routePaths: Map<RouteRef, string>,
  routeBindings: Map<AnyRouteRef, AnyRouteRef | undefined>,
): readonly [RouteRef | undefined, string] {
  // First we figure out which absolute route ref we're dealing with, an if there was an sub route path to append.
  // For sub routes it will be the parent path, while for external routes it will be the bound route.
  let targetRef: RouteRef;
  let subRoutePath = '';
  if (isRouteRef(anyRouteRef)) {
    targetRef = anyRouteRef;
  } else if (isSubRouteRef(anyRouteRef)) {
    targetRef = anyRouteRef.parent;
    subRoutePath = anyRouteRef.path;
  } else if (isExternalRouteRef(anyRouteRef)) {
    const resolvedRoute = routeBindings.get(anyRouteRef);
    if (!resolvedRoute) {
      return [undefined, ''];
    }
    if (isRouteRef(resolvedRoute)) {
      targetRef = resolvedRoute;
    } else if (isSubRouteRef(resolvedRoute)) {
      targetRef = resolvedRoute.parent;
      subRoutePath = resolvedRoute.path;
    } else {
      throw new Error(
        `ExternalRouteRef was bound to invalid target, ${resolvedRoute}`,
      );
    }
  } else if (anyRouteRef[routeRefType]) {
    throw new Error(
      `Unknown or invalid route ref type, ${anyRouteRef[routeRefType]}`,
    );
  } else {
    throw new Error(`Unknown object passed to useRouteRef, got ${anyRouteRef}`);
  }

  // Bail if no absolute path could be resolved
  if (!targetRef) {
    return [undefined, ''];
  }

  // Find the path that our target route is bound to
  const resolvedPath = routePaths.get(targetRef);
  if (resolvedPath === undefined) {
    return [undefined, ''];
  }

  // SubRouteRefs join the path from the parent route with its own path
  const targetPath = joinPaths(resolvedPath, subRoutePath);
  return [targetRef, targetPath];
}

/**
 * Resolves the complete base path for navigating to the target RouteRef.
 */
function resolveBasePath(
  targetRef: RouteRef,
  sourceLocation: Parameters<typeof matchRoutes>[1],
  routePaths: Map<RouteRef, string>,
  routeParents: Map<RouteRef, RouteRef | undefined>,
  routeObjects: BackstageRouteObject[],
) {
  // While traversing the app element tree we build up the routeObjects structure
  // used here. It is the same kind of structure that react-router creates, with the
  // addition that associated route refs are stored throughout the tree. This lets
  // us look up all route refs that can be reached from our source location.
  // Because of the similar route object structure, we can use `matchRoutes` from
  // react-router to do the lookup of our current location.
  const match = matchRoutes(routeObjects, sourceLocation) ?? [];

  // While we search for a common routing root between our current location and
  // the target route, we build a list of all route refs we find that we need
  // to traverse to reach the target.
  const refDiffList = Array<RouteRef>();

  let matchIndex = -1;
  for (
    let targetSearchRef: RouteRef | undefined = targetRef;
    targetSearchRef;
    targetSearchRef = routeParents.get(targetSearchRef)
  ) {
    // The match contains a list of all ancestral route refs present at our current location
    // Starting at the desired target ref and traversing back through its parents, we search
    // for a target ref that is present in the match for our current location. When a match
    // is found it means we have found a common base to resolve the route from.
    matchIndex = match.findIndex(m =>
      (m.route as BackstageRouteObject).routeRefs.has(targetSearchRef!),
    );
    if (matchIndex !== -1) {
      break;
    }

    // Every time we move a step up in the ancestry of the target ref, we add the current ref
    // to the diff list, which ends up being the list of route refs to traverse form the common base
    // in order to reach our target.
    refDiffList.unshift(targetSearchRef);
  }

  // If our target route is present in the initial match we need to construct the final path
  // from the parent of the matched route segment. That's to allow the caller of the route
  // function to supply their own params.
  if (refDiffList.length === 0) {
    matchIndex -= 1;
  }

  // This is the part of the route tree that the target and source locations have in common.
  // We re-use the existing pathname directly along with all params.
  const parentPath = matchIndex === -1 ? '' : match[matchIndex].pathname;

  // This constructs the mid section of the path using paths resolved from all route refs
  // we need to traverse to reach our target except for the very last one. None of these
  // paths are allowed to require any parameters, as the caller would have no way of knowing
  // what parameters those are.
  const diffPaths = refDiffList.slice(0, -1).map(ref => {
    const path = routePaths.get(ref);
    if (path === undefined) {
      throw new Error(`No path for ${ref}`);
    }
    if (path.includes(':')) {
      throw new Error(
        `Cannot route to ${targetRef} with parent ${ref} as it has parameters`,
      );
    }
    return path;
  });

  return `${joinPaths(parentPath, ...diffPaths)}/`;
}

export class RouteResolver {
  constructor(
    private readonly routePaths: Map<RouteRef, string>,
    private readonly routeParents: Map<RouteRef, RouteRef | undefined>,
    private readonly routeObjects: BackstageRouteObject[],
    private readonly routeBindings: Map<
      ExternalRouteRef,
      RouteRef | SubRouteRef
    >,
    private readonly appBasePath: string, // base path without a trailing slash
  ) {}

  resolve<Params extends AnyParams>(
    anyRouteRef:
      | RouteRef<Params>
      | SubRouteRef<Params>
      | ExternalRouteRef<Params, any>,
    sourceLocation: Parameters<typeof matchRoutes>[1],
  ): RouteFunc<Params> | undefined {
    // First figure out what our target absolute ref is, as well as our target path.
    const [targetRef, targetPath] = resolveTargetRef(
      anyRouteRef,
      this.routePaths,
      this.routeBindings,
    );
    if (!targetRef) {
      return undefined;
    }

    // The location that we get passed in uses the full path, so start by trimming off
    // the app base path prefix in case we're running the app on a sub-path.
    let relativeSourceLocation: Parameters<typeof matchRoutes>[1];
    if (typeof sourceLocation === 'string') {
      relativeSourceLocation = this.trimPath(sourceLocation);
    } else if (sourceLocation.pathname) {
      relativeSourceLocation = {
        ...sourceLocation,
        pathname: this.trimPath(sourceLocation.pathname),
      };
    } else {
      relativeSourceLocation = sourceLocation;
    }

    // Next we figure out the base path, which is the combination of the common parent path
    // between our current location and our target location, as well as the additional path
    // that is the difference between the parent path and the base of our target location.
    const basePath =
      this.appBasePath +
      resolveBasePath(
        targetRef,
        relativeSourceLocation,
        this.routePaths,
        this.routeParents,
        this.routeObjects,
      );

    const routeFunc: RouteFunc<Params> = (...[params]) => {
      // We selectively encode some some known-dangerous characters in the
      // params. The reason that we don't perform a blanket `encodeURIComponent`
      // here is that this encoding was added defensively long after the initial
      // release of this code. There's likely to be many users of this code that
      // already encode their parameters knowing that this code didn't do this
      // for them in the past. Therefore, we are extra careful NOT to include
      // the percent character in this set, even though that might seem like a
      // bad idea.
      const encodedParams =
        params &&
        mapValues(params, value => {
          if (typeof value === 'string') {
            return value.replaceAll(/[&?#;\/]/g, c => encodeURIComponent(c));
          }
          return value;
        });
      return joinPaths(basePath, generatePath(targetPath, encodedParams));
    };
    return routeFunc;
  }

  private trimPath(targetPath: string) {
    if (!targetPath) {
      return targetPath;
    }

    if (targetPath.startsWith(this.appBasePath)) {
      return targetPath.slice(this.appBasePath.length);
    }
    return targetPath;
  }
}

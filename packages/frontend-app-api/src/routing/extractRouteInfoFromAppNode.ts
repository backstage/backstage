/*
 * Copyright 2023 The Backstage Authors
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

import { RouteRef, coreExtensionData } from '@backstage/frontend-plugin-api';
import { BackstageRouteObject } from './types';
import { AppNode } from '@backstage/frontend-plugin-api';
import { toLegacyPlugin } from './toLegacyPlugin';

// We always add a child that matches all subroutes but without any route refs. This makes
// sure that we're always able to match each route no matter how deep the navigation goes.
// The route resolver then takes care of selecting the most specific match in order to find
// mount points that are as deep in the routing tree as possible.
export const MATCH_ALL_ROUTE: BackstageRouteObject = {
  caseSensitive: false,
  path: '*',
  element: 'match-all', // These elements aren't used, so we add in a bit of debug information
  routeRefs: new Set(),
  plugins: new Set(),
};

// Joins a list of paths together, avoiding trailing and duplicate slashes
export function joinPaths(...paths: string[]): string {
  const normalized = paths.join('/').replace(/\/\/+/g, '/');
  if (normalized !== '/' && normalized.endsWith('/')) {
    return normalized.slice(0, -1);
  }
  return normalized;
}

export function extractRouteInfoFromAppNode(node: AppNode): {
  routePaths: Map<RouteRef, string>;
  routeParents: Map<RouteRef, RouteRef | undefined>;
  routeObjects: BackstageRouteObject[];
} {
  // This tracks the route path for each route ref, the value is the route path relative to the parent ref
  const routePaths = new Map<RouteRef, string>();
  // This tracks the parents of each route ref. To find the full path of any route ref you traverse
  // upwards in this tree and substitute each route ref for its route path along then way.
  const routeParents = new Map<RouteRef, RouteRef | undefined>();
  // This route object tree is passed to react-router in order to be able to look up the current route
  // ref or extension/source based on our current location.
  const routeObjects = new Array<BackstageRouteObject>();

  function visit(
    current: AppNode,
    collectedPath?: string,
    foundRefForCollectedPath: boolean = false,
    parentRef?: RouteRef,
    candidateParentRef?: RouteRef,
    parentObj?: BackstageRouteObject,
  ) {
    const routePath = current.instance
      ?.getData(coreExtensionData.routePath)
      ?.replace(/^\//, '');
    const routeRef = current.instance?.getData(coreExtensionData.routeRef);
    const parentChildren = parentObj?.children ?? routeObjects;
    let currentObj = parentObj;

    let newCollectedPath = collectedPath;
    let newFoundRefForCollectedPath = foundRefForCollectedPath;

    let newParentRef = parentRef;
    let newCandidateParentRef = candidateParentRef;

    // Whenever a route path is encountered, a new node is created in the routing tree.
    if (routePath !== undefined) {
      currentObj = {
        path: routePath,
        element: 'mounted',
        routeRefs: new Set<RouteRef>(),
        caseSensitive: false,
        children: [MATCH_ALL_ROUTE],
        plugins: new Set(),
        appNode: current,
      };
      parentChildren.push(currentObj);

      // Each route path that we discover creates a new node in the routing tree, at that point
      // we also switch out our candidate parent ref to be the active one.
      newParentRef = candidateParentRef;
      newCandidateParentRef = undefined;

      // We need to collect and concatenate route paths until the path has been assigned a route ref:
      // Once we find a route ref the collection starts over from an empty path, that way each route
      // path assignment only contains the diff from the parent ref.
      if (newFoundRefForCollectedPath) {
        newCollectedPath = routePath;
        newFoundRefForCollectedPath = false;
      } else {
        newCollectedPath = collectedPath
          ? joinPaths(collectedPath, routePath)
          : routePath;
      }
    }

    // Whenever a route ref is encountered, we need to give it a route path and position in the ref tree.
    if (routeRef) {
      // The first route ref we find after encountering a route path is selected to be used as the
      // parent ref further down the tree. We don't start using this candidate ref until we encounter
      // another route path though, at which point we repeat the process and select another candidate.
      if (!newCandidateParentRef) {
        newCandidateParentRef = routeRef;
      }

      // Check if we've encountered any route paths since the closest route ref, in that case we assign
      // that path to this and following route refs until we encounter another route path.
      if (newCollectedPath !== undefined) {
        routePaths.set(routeRef, newCollectedPath);
        newFoundRefForCollectedPath = true;
      }

      routeParents.set(routeRef, newParentRef);
      currentObj?.routeRefs.add(routeRef);
      if (current.spec.source) {
        currentObj?.plugins.add(toLegacyPlugin(current.spec.source));
      }
    }

    for (const children of current.edges.attachments.values()) {
      for (const child of children) {
        visit(
          child,
          newCollectedPath,
          newFoundRefForCollectedPath,
          newParentRef,
          newCandidateParentRef,
          currentObj,
        );
      }
    }
  }

  visit(node);

  return { routePaths, routeParents, routeObjects };
}

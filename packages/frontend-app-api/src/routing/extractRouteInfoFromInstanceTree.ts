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

import { RouteRef } from '@backstage/core-plugin-api';
import { coreExtensionData } from '@backstage/frontend-plugin-api';
import { ExtensionInstance } from '../wiring/createExtensionInstance';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { BackstageRouteObject } from '../../../core-app-api/src/routing/types';
import { toLegacyPlugin } from '../wiring/createApp';

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

export function extractRouteInfoFromInstanceTree(roots: ExtensionInstance[]): {
  routePaths: Map<RouteRef, string>;
  routeParents: Map<RouteRef, RouteRef | undefined>;
  routeObjects: BackstageRouteObject[];
} {
  const routePaths = new Map<RouteRef, string>();
  const routeParents = new Map<RouteRef, RouteRef | undefined>();
  const routeObjects = new Array<BackstageRouteObject>();

  function visit(
    current: ExtensionInstance,
    parentRef?: RouteRef,
    parentObj?: BackstageRouteObject,
  ) {
    const routePath = current.getData(coreExtensionData.routePath) ?? ''; // TODO: need to gather routes instead
    const routeRef = current.getData(coreExtensionData.routeRef);
    const parentChildren = parentObj?.children ?? routeObjects;
    let currentObj = parentObj;

    if (routePath) {
      currentObj = {
        path: routePath,
        element: 'mounted',
        routeRefs: new Set<RouteRef>(),
        caseSensitive: false,
        children: [MATCH_ALL_ROUTE],
        plugins: new Set(),
      };

      parentChildren.push(currentObj);
    }

    if (routeRef) {
      const routeRefId = (routeRef as any).id; // TODO: properly
      if (routeRefId !== current.id) {
        throw new Error(
          `Route ref '${routeRefId}' must have the same ID as extension '${current.id}'`,
        );
      }
      routePaths.set(routeRef, routePath);
      routeParents.set(routeRef, parentRef);
      currentObj?.routeRefs.add(routeRef);
      if (current.source) {
        currentObj?.plugins.add(toLegacyPlugin(current.source));
      }
    }

    for (const children of current.attachments.values()) {
      for (const child of children) {
        visit(child, routeRef ?? parentRef, currentObj);
      }
    }
  }

  for (const root of roots) {
    visit(root);
  }

  return { routePaths, routeParents, routeObjects };
}

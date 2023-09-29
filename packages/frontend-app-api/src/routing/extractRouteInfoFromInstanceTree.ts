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

  function visit(current: ExtensionInstance, parent?: RouteRef) {
    const routePath = current.getData(coreExtensionData.routePath) ?? '';
    const routeRef = current.getData(coreExtensionData.routeRef);

    if (routeRef) {
      const routeRefId = (routeRef as any).id; // TODO: properly
      if (routeRefId !== current.id) {
        throw new Error(
          `Route ref '${routeRefId}' must have the same ID as extension '${current.id}'`,
        );
      }
      routePaths.set(routeRef, routePath);
      routeParents.set(routeRef, parent);
    }

    for (const children of current.attachments.values()) {
      for (const child of children) {
        visit(child, routeRef ?? parent);
      }
    }
  }

  for (const root of roots) {
    visit(root);
  }

  return { routePaths, routeParents, routeObjects: [] };
}

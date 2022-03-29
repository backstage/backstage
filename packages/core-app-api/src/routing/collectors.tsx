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

import {
  RouteRef,
  getComponentData,
  BackstagePlugin,
} from '@backstage/core-plugin-api';
import { BackstageRouteObject } from './types';
import { createCollector } from '../extensions/traversal';
import { FeatureFlagged, FeatureFlaggedProps } from './FeatureFlagged';

export const routePathCollector = createCollector(
  () => new Map<RouteRef, string>(),
  (acc, node, _parent, ctxPath: string | undefined) => {
    const path: string | undefined = node.props?.path || ctxPath;

    const routeRef = getComponentData<RouteRef>(node, 'core.mountPoint');
    if (routeRef) {
      if (!path) {
        throw new Error('Mounted routable extension must have a path');
      }
      acc.set(routeRef, path);
    }
    return path;
  },
);

export const routeParentCollector = createCollector(
  () => new Map<RouteRef, RouteRef | undefined>(),
  (acc, node, _parent, parentRef?: RouteRef) => {
    const routeRef = getComponentData<RouteRef>(node, 'core.mountPoint');
    if (routeRef) {
      acc.set(routeRef, parentRef);
      return routeRef;
    }

    return parentRef;
  },
);

// We always add a child that matches all subroutes but without any route refs. This makes
// sure that we're always able to match each route no matter how deep the navigation goes.
// The route resolver then takes care of selecting the most specific match in order to find
// mount points that are as deep in the routing tree as possible.
export const MATCH_ALL_ROUTE: BackstageRouteObject = {
  caseSensitive: false,
  path: '*',
  element: 'match-all', // These elements aren't used, so we add in a bit of debug information
  routeRefs: new Set(),
};

export const routeObjectCollector = createCollector(
  () => Array<BackstageRouteObject>(),
  (acc, node, _parent, parentObj: BackstageRouteObject | undefined) => {
    let currentObj = parentObj;
    const parentChildren = currentObj?.children ?? acc;

    const path: string | undefined = node.props?.path;
    if (path) {
      currentObj = {
        path,
        element: 'mounted',
        routeRefs: new Set(),
        caseSensitive: Boolean(node.props?.caseSensitive),
        children: [MATCH_ALL_ROUTE],
        // TODO(Rugvip): This is borked
        plugin: getComponentData<BackstagePlugin>(
          node.props.element,
          'core.plugin',
        ),
      };
      parentChildren.push(currentObj);
    }

    const routeRef = getComponentData<RouteRef>(node, 'core.mountPoint');
    if (routeRef) {
      parentObj?.routeRefs.add(routeRef);
    }

    return currentObj;
  },
);

export const featureFlagCollector = createCollector(
  () => new Set<string>(),
  (acc, node) => {
    if (node.type === FeatureFlagged) {
      const props = node.props as FeatureFlaggedProps;
      acc.add('with' in props ? props.with : props.without);
    }
  },
);

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

import { isValidElement, ReactNode } from 'react';
import { RouteRef } from '../routing/types';
import { getComponentData } from '../extensions';
import { createCollector } from '../extensions/traversal';

export const routeCollector = createCollector(
  () => new Map<RouteRef, string>(),
  (acc, node, parent) => {
    if (parent.props.element === node) {
      return;
    }

    const path: string | undefined = node.props?.path;
    const element: ReactNode = node.props?.element;

    const routeRef = getComponentData<RouteRef>(node, 'core.mountPoint');
    if (routeRef) {
      if (!path) {
        throw new Error('Mounted routable extension must have a path');
      }
      acc.set(routeRef, path);
    } else if (isValidElement(element)) {
      const elementRouteRef = getComponentData<RouteRef>(
        element,
        'core.mountPoint',
      );
      if (elementRouteRef) {
        if (!path) {
          throw new Error('Route element must have a path');
        }
        acc.set(elementRouteRef, path);
      }
    }
  },
);

export const routeParentCollector = createCollector(
  () => new Map<RouteRef, RouteRef | undefined>(),
  (acc, node, parent, parentRouteRef?: RouteRef) => {
    if (parent.props.element === node) {
      return parentRouteRef;
    }

    const element: ReactNode = node.props?.element;

    let nextParent = parentRouteRef;

    const routeRef = getComponentData<RouteRef>(node, 'core.mountPoint');
    if (routeRef) {
      acc.set(routeRef, parentRouteRef);
      nextParent = routeRef;
    } else if (isValidElement(element)) {
      const elementRouteRef = getComponentData<RouteRef>(
        element,
        'core.mountPoint',
      );

      if (elementRouteRef) {
        acc.set(elementRouteRef, parentRouteRef);
        nextParent = elementRouteRef;
      }
    }

    return nextParent;
  },
);

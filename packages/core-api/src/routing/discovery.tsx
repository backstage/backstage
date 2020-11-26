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

import React, { isValidElement, ReactNode } from 'react';
import { RouteRef } from './types';
import { getComponentData } from '../lib/componentData';

export const collectRoutes = (tree: ReactNode) => {
  const treeMap = new Map<RouteRef, string>();

  const visited = new Set();
  const nodes = [tree];

  while (nodes.length !== 0) {
    const node = nodes.shift();
    if (!isIterableElement(node)) {
      continue;
    }
    if (visited.has(node)) {
      const anyType = node?.type as
        | { displayName?: string; name?: string }
        | undefined;
      const name = anyType?.displayName || anyType?.name || String(anyType);
      throw new Error(`Visited element ${name} twice`);
    }
    visited.add(node);

    React.Children.forEach(node, child => {
      if (!isIterableElement(child)) {
        return;
      }

      const { path, element, children } = child.props as {
        path?: string;
        element?: ReactNode;
        children?: ReactNode;
      };
      if (path) {
        const routeRef = getComponentData<RouteRef>(child, 'core.mountPoint');
        if (routeRef) {
          treeMap.set(routeRef, path);
        } else if (isIterableElement(element)) {
          const elementRouteRef = getComponentData<RouteRef>(
            element,
            'core.mountPoint',
          );
          if (elementRouteRef) {
            treeMap.set(elementRouteRef, path);
          }
          nodes.push(element.props?.children);
        }
      }
      nodes.push(children);
    });
  }

  return treeMap;
};

export const collectRouteParents = (tree: ReactNode) => {
  const treeMap = new Map<RouteRef, RouteRef | undefined>();

  const nodes = [{ node: tree, parent: undefined as RouteRef | undefined }];

  while (nodes.length !== 0) {
    const { parent, node } = nodes.shift()!;
    if (!isIterableElement(node)) {
      continue;
    }

    React.Children.forEach(node, child => {
      if (!isIterableElement(child)) {
        return;
      }

      const { path, element, children } = child.props as {
        path?: string;
        element?: ReactNode;
        children?: ReactNode;
      };

      let nextParent = parent;

      if (path) {
        const routeRef = getComponentData<RouteRef>(child, 'core.mountPoint');
        if (routeRef) {
          treeMap.set(routeRef, parent);
          nextParent = routeRef;
        } else if (isIterableElement(element)) {
          const elementRouteRef = getComponentData<RouteRef>(
            element,
            'core.mountPoint',
          );
          if (elementRouteRef) {
            treeMap.set(elementRouteRef, parent);

            nextParent = elementRouteRef;
            nodes.push({
              parent: elementRouteRef,
              node: element.props?.children,
            });
          } else {
            nodes.push({ parent, node: element.props?.children });
          }
        }
      }
      nodes.push({ parent: nextParent, node: children });
    });
  }

  return treeMap;
};

function isIterableElement(node: ReactNode): node is JSX.Element {
  return isValidElement(node) || Array.isArray(node);
}

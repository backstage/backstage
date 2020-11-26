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
import { getComponentData } from '../extensions';

type TraverseFunc<Context> = (
  node: JSX.Element,
  context: Context,
) => Generator<
  Context extends undefined
    ? { children: JSX.Element; context?: Context }
    : { children: JSX.Element; context: Context },
  void,
  void
>;

function traverse<Context>(
  root: ReactNode,
  initialContext: Context,
  traverseFunc: TraverseFunc<Context>,
): void {
  const visited = new Set();
  const nodes = [{ children: root, context: initialContext }];

  while (nodes.length !== 0) {
    const { children, context } = nodes.shift()!;

    React.Children.forEach(children, child => {
      if (!isIterableElement(child)) {
        return;
      }
      if (visited.has(child)) {
        const anyType = child?.type as
          | { displayName?: string; name?: string }
          | undefined;
        const name = anyType?.displayName || anyType?.name || String(anyType);
        throw new Error(`Visited element ${name} twice`);
      }
      visited.add(child);

      for (const next of traverseFunc(child, context)) {
        nodes.push(next as { children: JSX.Element; context: Context });
      }
    });
  }
}

export const collectRoutes = (tree: ReactNode) => {
  const treeMap = new Map<RouteRef, string>();

  traverse(tree, undefined, function* traverseFunc(node) {
    const { path, element, children } = node.props as {
      path?: string;
      element?: ReactNode;
      children?: ReactNode;
    };
    if (path) {
      const routeRef = getComponentData<RouteRef>(node, 'core.mountPoint');
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
        yield { children: element.props?.children };
      }
    }

    yield { children };
  });

  return treeMap;
};

export const collectRouteParents = (tree: ReactNode) => {
  const treeMap = new Map<RouteRef, RouteRef | undefined>();

  traverse<RouteRef | undefined>(tree, undefined, function* traverseFunc(
    node,
    parent,
  ) {
    const { path, element, children } = node.props as {
      path?: string;
      element?: ReactNode;
      children?: ReactNode;
    };

    let nextParent = parent;

    if (path) {
      const routeRef = getComponentData<RouteRef>(node, 'core.mountPoint');
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
          yield { children: element.props?.children, context: elementRouteRef };
        } else {
          yield { children: element.props?.children, context: parent };
        }
      }
    }
    yield { children, context: nextParent };
  });

  return treeMap;
};

function isIterableElement(node: ReactNode): node is JSX.Element {
  return isValidElement(node) || Array.isArray(node);
}

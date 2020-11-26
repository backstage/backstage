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

import { isValidElement, ReactNode, ReactElement, Children } from 'react';
import { RouteRef } from './types';
import { getComponentData } from '../extensions';

type TraverseFunc<Context> = (
  node: ReactElement,
  parent: ReactElement,
  context: Context,
) => Generator<
  Context extends undefined
    ? { children: ReactNode; context?: Context }
    : { children: ReactNode; context: Context },
  void,
  void
>;

function traverse<Context = undefined>(
  options: { root: ReactElement; initialContext?: Context },
  traverseFunc: TraverseFunc<Context>,
): void {
  const visited = new Set();
  const nodes: Array<{
    children: ReactNode;
    parent: ReactElement;
    context: Context;
  }> = [
    {
      children: Children.toArray(options.root),
      parent: options.root,
      context: options.initialContext!,
    },
  ];

  while (nodes.length !== 0) {
    const { children, parent, context } = nodes.shift()!;

    Children.forEach(children, child => {
      if (!isValidElement(child)) {
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

      for (const next of traverseFunc(child, parent, context)) {
        nodes.push({
          children: next.children,
          context: next.context!,
          parent: child,
        });
      }
    });
  }
}

export const collectRoutes = (root: ReactElement) => {
  const treeMap = new Map<RouteRef, string>();

  traverse({ root }, function* traverseFunc(node, parent: ReactElement) {
    const { path, element, children } = node.props as {
      path?: string;
      element?: ReactNode;
      children?: ReactNode;
    };
    if (parent.props.element === node) {
      yield { children };
      return;
    }
    const routeRef = getComponentData<RouteRef>(node, 'core.mountPoint');
    if (routeRef) {
      if (!path) {
        throw new Error('Mounted routable extension must have a path');
      }
      treeMap.set(routeRef, path);
    } else if (isValidElement(element)) {
      const elementRouteRef = getComponentData<RouteRef>(
        element,
        'core.mountPoint',
      );
      if (elementRouteRef) {
        if (!path) {
          throw new Error('Route element must have a path');
        }
        treeMap.set(elementRouteRef, path);
      }
      yield { children: element };
    }

    yield { children };
  });

  return treeMap;
};

export const collectRouteParents = (root: ReactElement) => {
  const treeMap = new Map<RouteRef, RouteRef | undefined>();

  traverse<RouteRef | undefined>(
    { root, initialContext: undefined },
    function* traverseFunc(node, parent, parentRouteRef) {
      const { element, children } = node.props as {
        element?: ReactNode;
        children?: ReactNode;
      };
      if (parent.props.element === node) {
        yield { children };
        return;
      }

      let nextParent = parentRouteRef;

      const routeRef = getComponentData<RouteRef>(node, 'core.mountPoint');
      if (routeRef) {
        treeMap.set(routeRef, parentRouteRef);
        nextParent = routeRef;
      } else if (isValidElement(element)) {
        const elementRouteRef = getComponentData<RouteRef>(
          element,
          'core.mountPoint',
        );

        if (elementRouteRef) {
          treeMap.set(elementRouteRef, parentRouteRef);
          nextParent = elementRouteRef;
          yield { children: element, context: elementRouteRef };
        } else {
          yield { children: element, context: parentRouteRef };
        }
      }
      yield { children, context: nextParent };
    },
  );

  return treeMap;
};

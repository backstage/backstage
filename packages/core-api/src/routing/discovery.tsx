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

type Discoverer = (element: ReactElement) => ReactNode;

type Collector<Result, Context> = () => {
  accumulator: Result;
  visit(
    accumulator: Result,
    element: ReactElement,
    parent: ReactElement,
    context: Context,
  ): Context;
};

/**
 * A function that allows you to traverse a tree of React elements using
 * varying methods to discover child nodes and collect data along the way.
 */
export function traverseElementTree<Results>(options: {
  root: ReactElement;
  discoverers: Discoverer[];
  collectors: { [name in keyof Results]: Collector<Results[name], any> };
}): Results {
  const visited = new Set();
  const collectors: {
    [name in string]: ReturnType<Collector<any, any>>;
  } = {};

  // Bootstrap all collectors, initializing the accumulators and providing the visitor function
  for (const name in options.collectors) {
    if (options.collectors.hasOwnProperty(name)) {
      collectors[name] = options.collectors[name]();
    }
  }

  // Internal representation of an element in the tree that we're iterating over
  type QueueItem = {
    node: ReactNode;
    parent: ReactElement;
    contexts: { [name in string]: unknown };
  };

  const queue = [
    {
      node: Children.toArray(options.root),
      parent: options.root,
      contexts: {},
    } as QueueItem,
  ];

  while (queue.length !== 0) {
    const { node, parent, contexts } = queue.shift()!;

    // While the parent and the element we pass on to collectors and discoverers
    // have been validated and are known to be React elements, the child nodes
    // emitted by the discoverers are not.
    Children.forEach(node, element => {
      if (!isValidElement(element)) {
        return;
      }
      if (visited.has(element)) {
        const anyType = element?.type as
          | { displayName?: string; name?: string }
          | undefined;
        const name = anyType?.displayName || anyType?.name || String(anyType);
        throw new Error(`Visited element ${name} twice`);
      }
      visited.add(element);

      const nextContexts: QueueItem['contexts'] = {};

      // Collectors populate their result data using the current node, and compute
      // context for the next iteration
      for (const name in collectors) {
        if (collectors.hasOwnProperty(name)) {
          const collector = collectors[name];

          nextContexts[name] = collector.visit(
            collector.accumulator,
            element,
            parent,
            contexts[name],
          );
        }
      }

      // Discoverers provide ways to continue the traversal from the current element
      for (const discoverer of options.discoverers) {
        const children = discoverer(element);
        if (children) {
          queue.push({
            node: children,
            parent: element,
            contexts: nextContexts,
          });
        }
      }
    });
  }

  return Object.fromEntries(
    Object.entries(collectors).map(([name, c]) => [name, c.accumulator]),
  ) as Results;
}

export function childDiscoverer(element: ReactElement): ReactNode {
  return element.props?.children;
}

export function routeElementDiscoverer(element: ReactElement): ReactNode {
  if (element.props?.path && element.props?.element) {
    return element.props?.element;
  }
  return undefined;
}

function createCollector<Result, Context>(
  initialResult: Result,
  visit: ReturnType<Collector<Result, Context>>['visit'],
): Collector<Result, Context> {
  return () => ({ accumulator: initialResult, visit });
}

export const routeCollector = createCollector(
  new Map<RouteRef, string>(),
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
  new Map<RouteRef, RouteRef | undefined>(),
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

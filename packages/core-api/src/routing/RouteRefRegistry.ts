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

import {
  ConcreteRoute,
  routeReference,
  resolveRoute,
  ReferencedRoute,
} from './types';

const rootRoute: ConcreteRoute = {
  get [routeReference]() {
    return this;
  },
  [resolveRoute]: () => '',
};

export type RouteRefResolver = {
  resolveRoute(from: ConcreteRoute[], to: ConcreteRoute[]): string;
};

class Node {
  readonly children = new Map<unknown, Node>();

  constructor(readonly path: string, readonly parent: Node | undefined) {}

  /**
   * Look up a node in the tree given a path.
   */
  findNode(routes: ReferencedRoute[]): Node | undefined {
    let node = this as Node | undefined;

    for (let i = 0; i < routes.length; i++) {
      node = node?.children.get(routes[i][routeReference]);
    }

    return node;
  }

  /**
   * Assigns a path to a leaf node in the routing tree. All ancestor
   * nodes of the new leaf node must already exist, or an error will be thrown.
   *
   * Returns true if the node was added, or false if the node already existed.
   */
  addNode(routes: ReferencedRoute[], path: string): boolean {
    if (routes.length === 0) {
      throw new Error('Must provide at least 1 route to add routing node');
    }

    const parentNode = this.findNode(routes.slice(0, -1));
    if (!parentNode) {
      throw new Error('Could not find parent for new routing node');
    }

    const lastRoute = routes[routes.length - 1];
    const lastRouteRef = lastRoute[routeReference];

    const existingNode = parentNode.children.get(lastRouteRef);
    if (existingNode) {
      return existingNode.path === path;
    }

    parentNode.children.set(lastRouteRef, new Node(path, parentNode));
    return true;
  }

  /**
   * Resolve an absolute URL that represents this node in the routing tree, using
   * using the supplied concrete routes and ancestors of this node.
   *
   * The length of the provided routes array must match the depth of
   * the routing tree that this node is at, or an error will be thrown.
   */
  resolve(routes: ConcreteRoute[]) {
    const parts = Array(routes.length);

    let node = this as Node | undefined;
    for (let i = routes.length - 1; i >= 0; i--) {
      if (!node) {
        throw new Error('Route resolve missing required parent');
      }

      const route = routes[i];
      parts[i] = route[resolveRoute](node.path);

      node = node.parent;
    }

    if (node) {
      throw new Error('Route resolve did not reach root');
    }

    return parts.join('/');
  }
}

/**
 * A registry for resolving route refs into concrete string routes.
 */
export class RouteRefRegistry {
  private readonly root = new Node('', undefined);

  /**
   * Register a new leaf path for a sequence of routes. All ancestor
   * routes must already exist.
   */
  registerRoute(routes: ReferencedRoute[], path: string): boolean {
    return this.root.addNode(routes, path);
  }

  /**
   * Resolve an absolute path from a point in the routing tree.
   *
   * The route referenced by `from` must exist, and is the starting
   * point for the search, walking up the tree until a subtree that
   * matches the routes reference in `to` are found.
   *
   * If `from` is empty, the search starts and ends at the root node.
   * If `to` is empty, the route referenced by `from` will always be returned.
   */
  resolveRoute(from: ConcreteRoute[], to: ConcreteRoute[]): string | undefined {
    // Keep track of the `from` routes and pop the last ones as we traverse up
    // the routing tree. The list of concrete routes that we're passing to
    // `node.resolve()` should only include the ones in the resolve path.
    const concreteStack = from.slice();

    let fromNode = this.root.findNode(from);
    while (fromNode) {
      const resolvedNode = fromNode.findNode(to);
      if (resolvedNode) {
        return resolvedNode.resolve([rootRoute].concat(concreteStack, to));
      }

      // Search at this level of the tree failed, move up to parent
      concreteStack.pop();
      fromNode = fromNode.parent;
    }

    return undefined;
  }
}

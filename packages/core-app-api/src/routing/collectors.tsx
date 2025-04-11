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
import { isValidElement, ReactNode, Children } from 'react';
import { BackstageRouteObject } from './types';
import { createCollector } from '../extensions/traversal';
import { FeatureFlagged, FeatureFlaggedProps } from './FeatureFlagged';

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

function stringifyNode(node: ReactNode): string {
  const anyNode = node as { type?: { displayName?: string; name?: string } };
  if (anyNode?.type) {
    return (
      anyNode.type.displayName ?? anyNode.type.name ?? String(anyNode.type)
    );
  }
  return String(anyNode);
}

const pluginSet = (
  plugin: BackstagePlugin | undefined,
): Set<BackstagePlugin> => {
  const set = new Set<BackstagePlugin>();
  if (plugin) {
    set.add(plugin);
  }
  return set;
};

interface RoutingV2CollectorContext {
  routeRef?: RouteRef;
  gatherPath?: string;
  gatherRouteRef?: RouteRef;
  obj?: BackstageRouteObject;
  isElementAncestor?: boolean;
}

// This collects all the mount points and their plugins within an element tree.
// Unlike regular traversal this ignores all other things, like path props and mount point gatherers.
function collectSubTree(
  node: ReactNode,
  entries = new Array<{ routeRef: RouteRef; plugin?: BackstagePlugin }>(),
) {
  Children.forEach(node, element => {
    if (!isValidElement(element)) {
      return;
    }

    const routeRef = getComponentData<RouteRef>(element, 'core.mountPoint');
    if (routeRef) {
      const plugin = getComponentData<BackstagePlugin>(element, 'core.plugin');
      entries.push({ routeRef, plugin });
    }

    collectSubTree(element.props.children, entries);
  });

  return entries;
}

export const routingV2Collector = createCollector(
  () => ({
    paths: new Map<RouteRef, string>(),
    parents: new Map<RouteRef, RouteRef | undefined>(),
    objects: new Array<BackstageRouteObject>(),
  }),
  (acc, node, parent, ctx?: RoutingV2CollectorContext) => {
    // If we're in an element prop, ignore everything
    if (ctx?.isElementAncestor) {
      return ctx;
    }

    // Start ignoring everything if we enter an element prop
    if (parent?.props.element === node) {
      return { ...ctx, isElementAncestor: true };
    }

    const pathProp: unknown = node.props?.path;

    const mountPoint = getComponentData<RouteRef>(node, 'core.mountPoint');
    if (mountPoint && pathProp) {
      throw new Error(
        `Path property may not be set directly on a routable extension "${stringifyNode(
          node,
        )}"`,
      );
    }

    const parentChildren = ctx?.obj?.children ?? acc.objects;

    if (pathProp !== undefined) {
      if (typeof pathProp !== 'string') {
        throw new Error(
          `Element path must be a string at "${stringifyNode(node)}"`,
        );
      }

      const path = pathProp.startsWith('/') ? pathProp.slice(1) : pathProp;

      const elementProp = node.props.element;

      if (getComponentData<boolean>(node, 'core.gatherMountPoints')) {
        if (elementProp) {
          throw new Error(
            `Mount point gatherers may not have an element prop "${stringifyNode(
              node,
            )}"`,
          );
        }

        const newObj = {
          path,
          element: 'gathered',
          routeRefs: new Set<RouteRef>(),
          caseSensitive: Boolean(node.props?.caseSensitive),
          children: [MATCH_ALL_ROUTE],
          plugins: new Set<BackstagePlugin>(),
        };
        parentChildren.push(newObj);

        return {
          obj: newObj,
          gatherPath: path,
          routeRef: ctx?.routeRef,
          gatherRouteRef: ctx?.routeRef,
        };
      }

      if (elementProp) {
        const [extension, ...others] = collectSubTree(elementProp);
        if (others.length > 0) {
          throw new Error(
            `Route element with path "${pathProp}" may not contain multiple routable extensions`,
          );
        }
        if (!extension) {
          return ctx;
        }
        const { routeRef, plugin } = extension;

        const newObj = {
          path,
          element: 'mounted',
          routeRefs: new Set([routeRef]),
          caseSensitive: Boolean(node.props?.caseSensitive),
          children: [MATCH_ALL_ROUTE],
          plugins: pluginSet(plugin),
        };
        parentChildren.push(newObj);
        acc.paths.set(routeRef, path);
        acc.parents.set(routeRef, ctx?.routeRef);

        return {
          obj: newObj,
          routeRef: routeRef ?? ctx?.routeRef,
          gatherPath: path,
          gatherRouteRef: ctx?.gatherRouteRef,
        };
      }
    }

    if (mountPoint) {
      if (ctx?.gatherPath === undefined) {
        throw new Error(
          `Routable extension "${stringifyNode(
            node,
          )}" with mount point "${mountPoint}" must be assigned a path`,
        );
      }

      ctx?.obj?.routeRefs.add(mountPoint);

      const mountPointPlugin = getComponentData<BackstagePlugin>(
        node,
        'core.plugin',
      );
      if (mountPointPlugin) {
        ctx?.obj?.plugins.add(mountPointPlugin);
      }

      acc.paths.set(mountPoint, ctx.gatherPath);
      acc.parents.set(mountPoint, ctx?.gatherRouteRef);

      return {
        ...ctx,
        routeRef: mountPoint,
      };
    }

    return ctx;
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

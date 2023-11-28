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

import React, { ReactNode } from 'react';
import {
  createApiExtension,
  createPageExtension,
  createPlugin,
  BackstagePlugin,
  ExtensionDefinition,
} from '@backstage/frontend-plugin-api';
import { Route, Routes } from 'react-router-dom';
import {
  BackstagePlugin as LegacyBackstagePlugin,
  RouteRef,
  getComponentData,
} from '@backstage/core-plugin-api';
import { convertLegacyRouteRef } from './convertLegacyRouteRef';

/*

# Legacy interoperability

Use-cases (prioritized):
 1. Slowly migrate over an existing app to DI, piece by piece
 2. Use a legacy plugin in a new DI app
 3. Use DI in an existing legacy app

Starting point: use-case #1

Potential solutions:
 1. Codemods (we're not considering this for now)
 2. Legacy apps are migrated bottom-up, i.e. keep legacy root, replace pages with DI
 3. Legacy apps are migrated top-down i.e. switch out base to DI, legacy adapter allows for usage of existing app structure

Chosen path: #3

Existing tasks:
  - Adopters can migrate their existing app gradually (~4)
    - Example-app uses legacy base with DI adapters
    - Create an API that lets you inject DI into existing apps - working assumption is that this is enough
  - Adopters can use legacy plugins in DI through adapters (~8)
    - App-next uses DI base with legacy adapters
    - Create a legacy adapter that is able to take an existing extension tree

*/

/** @public */
export function collectLegacyRoutes(
  flatRoutesElement: JSX.Element,
): BackstagePlugin[] {
  const createdPluginIds = new Map<
    LegacyBackstagePlugin,
    ExtensionDefinition<unknown>[]
  >();

  React.Children.forEach(
    flatRoutesElement.props.children,
    (route: ReactNode) => {
      if (!React.isValidElement(route)) {
        return;
      }

      // TODO(freben): Handle feature flag and permissions framework wrapper elements
      if (route.type !== Route) {
        return;
      }

      const routeElement = route.props.element;

      // TODO: to support deeper extension component, e.g. hidden within <RequirePermission>, use https://github.com/backstage/backstage/blob/518a34646b79ec2028cc0ed6bc67d4366c51c4d6/packages/core-app-api/src/routing/collectors.tsx#L69
      const plugin = getComponentData<LegacyBackstagePlugin>(
        routeElement,
        'core.plugin',
      );
      if (!plugin) {
        return;
      }

      const routeRef = getComponentData<RouteRef>(
        routeElement,
        'core.mountPoint',
      );

      const detectedExtensions =
        createdPluginIds.get(plugin) ??
        new Array<ExtensionDefinition<unknown>>();
      createdPluginIds.set(plugin, detectedExtensions);

      const path: string = route.props.path;

      detectedExtensions.push(
        createPageExtension({
          name: detectedExtensions.length
            ? String(detectedExtensions.length + 1)
            : undefined,
          defaultPath: path[0] === '/' ? path.slice(1) : path,
          routeRef: routeRef ? convertLegacyRouteRef(routeRef) : undefined,

          loader: async () =>
            route.props.children ? (
              <Routes>
                <Route path="*" element={routeElement}>
                  <Route path="*" element={route.props.children} />
                </Route>
              </Routes>
            ) : (
              routeElement
            ),
        }),
      );
    },
  );

  return Array.from(createdPluginIds).map(([plugin, extensions]) =>
    createPlugin({
      id: plugin.getId(),
      extensions: [
        ...extensions,
        ...Array.from(plugin.getApis()).map(factory =>
          createApiExtension({ factory }),
        ),
      ],
    }),
  );
}

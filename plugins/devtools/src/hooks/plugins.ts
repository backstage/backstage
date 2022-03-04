/*
 * Copyright 2022 The Backstage Authors
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

import { useMemo } from 'react';
import { ExternalRouteRef, RouteRef, useApp } from '@backstage/core-plugin-api';

import { useMemoArray } from './memo-array';
import {
  DevToolsPluginRouteInfoPlugin,
  DevToolPlugins,
  DevToolPlugin,
} from '../types';
import { parseApis } from '../utils/api';

export function useDevToolsPlugins(): DevToolPlugins {
  const rawPlugins = useMemoArray(useApp().getPlugins());

  const plugins = useMemo(
    () =>
      rawPlugins.map((plugin): DevToolPlugin => {
        const pluginApis = [...plugin.getApis()];
        const providedApiIds = pluginApis.map(api => api.api.id);
        const parsedApis = parseApis(pluginApis);
        return {
          plugin,
          id: plugin.getId(),
          featureFlags: [...plugin.getFeatureFlags()].map(({ name }) => ({
            name,
          })),
          providedApiIds,
          apiIds: parsedApis.map(api => api.id),
          parsedApis,
        };
      }),
    [rawPlugins],
  );

  const routeInfo = useMemo(() => {
    const routeRefMap = new Map<RouteRef, DevToolsPluginRouteInfoPlugin>();
    const externalRouteRefMap = new Map<
      ExternalRouteRef,
      DevToolsPluginRouteInfoPlugin
    >();

    rawPlugins.map(plugin => {
      Object.entries(plugin.routes as Record<string, RouteRef>).forEach(
        ([name, ref]) => {
          routeRefMap.set(ref, { name, plugin });
        },
      );

      Object.entries(
        plugin.externalRoutes as Record<string, ExternalRouteRef>,
      ).forEach(([name, ref]) => {
        externalRouteRefMap.set(ref, { name, plugin });
      });
    });

    return { routeRefMap, externalRouteRefMap };
  }, [rawPlugins]);

  const apiMap = useMemo(
    () =>
      new Map<string, DevToolPlugin>(
        plugins.flatMap(plugin => plugin.apiIds.map(id => [id, plugin])),
      ),
    [plugins],
  );

  return {
    plugins,
    ...routeInfo,
    apiMap,
  };
}

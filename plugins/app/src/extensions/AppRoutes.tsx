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

import {
  createExtension,
  coreExtensionData,
  createExtensionInput,
  NotFoundErrorPage,
} from '@backstage/frontend-plugin-api';
import { useEffect } from 'react';
import {
  matchRoutes,
  useLocation,
  useRoutes,
  type RouteObject,
} from 'react-router-dom';
import { usePluginRoute } from './PluginRouteContext';

type RouteObjectWithHandle = RouteObject & {
  handle?: { pluginId?: string };
};

export function PluginAwareRoutes({
  routes,
}: {
  routes: RouteObjectWithHandle[];
}) {
  const element = useRoutes(routes);
  const location = useLocation();
  const { setPluginId } = usePluginRoute();

  useEffect(() => {
    const matches = matchRoutes(routes, location);
    const matchedPluginId = matches
      ?.map(match => {
        const handle = match.route.handle as { pluginId?: string } | undefined;
        return handle?.pluginId;
      })
      .filter(
        (pluginId): pluginId is string =>
          typeof pluginId === 'string' && pluginId.length > 0,
      )
      .pop();

    setPluginId(matchedPluginId);
  }, [location, routes, setPluginId]);

  return element;
}

export const AppRoutes = createExtension({
  name: 'routes',
  attachTo: { id: 'app/layout', input: 'content' },
  inputs: {
    routes: createExtensionInput([
      coreExtensionData.routePath,
      coreExtensionData.routeRef.optional(),
      coreExtensionData.reactElement,
    ]),
  },
  output: [coreExtensionData.reactElement],
  factory({ inputs }) {
    const routes: RouteObjectWithHandle[] = [
      ...inputs.routes.map(route => {
        const routePath = route.get(coreExtensionData.routePath);
        const pluginId = route.node.spec.plugin.id;

        return {
          path:
            routePath === '/' ? routePath : `${routePath.replace(/\/$/, '')}/*`,
          element: route.get(coreExtensionData.reactElement),
          handle: { pluginId },
        };
      }),
      {
        path: '*',
        element: <NotFoundErrorPage />,
      },
    ];

    return [
      coreExtensionData.reactElement(<PluginAwareRoutes routes={routes} />),
    ];
  },
});

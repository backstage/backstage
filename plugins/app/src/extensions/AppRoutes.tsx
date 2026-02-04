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
import { useRoutes, Outlet } from 'react-router-dom';

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
    const Routes = () => {
      const element = useRoutes([
        ...inputs.routes.map(route => {
          const routePath = route.get(coreExtensionData.routePath);
          const routeElement = route.get(coreExtensionData.reactElement);

          // For v7_relativeSplatPath: convert splat paths to parent/child structure
          if (routePath === '/') {
            // Root route: parent with index and splat children
            return {
              path: '/',
              element: <Outlet />,
              children: [
                {
                  index: true,
                  element: routeElement,
                },
                {
                  path: '*',
                  element: routeElement,
                },
              ],
            };
          }

          // Non-root routes: parent route with splat child
          const normalizedPath = routePath.replace(/\/$/, '');
          return {
            path: normalizedPath,
            element: <Outlet />,
            children: [
              {
                index: true,
                element: routeElement,
              },
              {
                path: '*',
                element: routeElement,
              },
            ],
          };
        }),
        {
          path: '*',
          element: <NotFoundErrorPage />,
        },
      ]);

      return element;
    };

    return [coreExtensionData.reactElement(<Routes />)];
  },
});

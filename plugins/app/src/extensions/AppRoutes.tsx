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
  coreComponentRefs,
  useComponentRef,
} from '@backstage/frontend-plugin-api';
import { useRoutes } from 'react-router-dom';

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
      const NotFoundErrorPage = useComponentRef(
        coreComponentRefs.notFoundErrorPage,
      );

      const element = useRoutes([
        ...inputs.routes.map(route => ({
          path: `${route.get(coreExtensionData.routePath)}/*`,
          element: route.get(coreExtensionData.reactElement),
        })),
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

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

import { ApiEntity } from '@backstage/catalog-model';
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
} from '@backstage/core';
import { ApiExplorerPage } from './components/ApiExplorerPage/ApiExplorerPage';
import { defaultDefinitionWidgets } from './components/ApiDefinitionCard';
import { rootRoute } from './routes';
import { apiDocsConfigRef } from './config';

export const plugin = createPlugin({
  id: 'api-docs',
  apis: [
    createApiFactory({
      api: apiDocsConfigRef,
      deps: {},
      factory: () => {
        const definitionWidgets = defaultDefinitionWidgets();
        return {
          getApiDefinitionWidget: (apiEntity: ApiEntity) => {
            return definitionWidgets.find(d => d.type === apiEntity.spec.type);
          },
        };
      },
    }),
  ],
  routes: {
    root: rootRoute,
  },
  register({ router }) {
    router.addRoute(rootRoute, ApiExplorerPage);
  },
});

export const ApiDocsExplorerPage = plugin.provide(
  createRoutableExtension({
    mountPoint: rootRoute,
    component: () =>
      import('./components/ApiExplorerPage/ApiExplorerPage').then(
        m => m.ApiExplorerPage,
      ),
  }),
);

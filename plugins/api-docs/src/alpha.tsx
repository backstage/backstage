/*
 * Copyright 2024 The Backstage Authors
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

import React from 'react';

import {
  createApiExtension,
  createApiFactory,
  createPageExtension,
  createPlugin,
  createSchemaFromZod,
} from '@backstage/frontend-plugin-api';
import { convertLegacyRouteRef } from '@backstage/core-compat-api';
import { ApiEntity } from '@backstage/catalog-model';

import { defaultDefinitionWidgets } from './components/ApiDefinitionCard';
import { rootRoute, registerComponentRouteRef } from './routes';
import { apiDocsConfigRef } from './config';
import { createEntityCardExtension } from '@backstage/plugin-catalog-react/alpha';

const ApiDocsConfigApi = createApiExtension({
  factory: createApiFactory({
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
});

const ApiDocsExplorerPage = createPageExtension({
  defaultPath: '/api-docs',
  routeRef: convertLegacyRouteRef(rootRoute),
  // Mapping DefaultApiExplorerPageProps to config
  configSchema: createSchemaFromZod(z =>
    z.object({
      path: z.string().default('/api-docs'),
      initiallySelectedFilter: z.enum(['owned', 'starred', 'all']).optional(),
      // Ommiting columns and actions for now as their types are too complex to map to zod
    }),
  ),
  loader: () =>
    import('./components/ApiExplorerPage').then(m => (
      <m.ApiExplorerIndexPage />
    )),
});

const ApiDocsDefinitionEntityCard = createEntityCardExtension({
  name: 'api-definition',
  loader: () =>
    import('./components/ApiDefinitionCard').then(m => <m.ApiDefinitionCard />),
});

const ApiDocsConsumedApisEntityCard = createEntityCardExtension({
  name: 'consumed-apis',
  // Ommiting configSchema for now
  // we are skipping variations, see: https://github.com/backstage/backstage/pull/22619#discussion_r1477333252
  // and columns are too complex to map to zod
  loader: () =>
    import('./components/ApisCards').then(m => <m.ConsumedApisCard />),
});

const ApiDocsHasApisEntityCard = createEntityCardExtension({
  name: 'has-apis',
  // we are skipping variations, see: https://github.com/backstage/backstage/pull/22619#discussion_r1477333252
  // and columns are too complex to map to zod
  loader: () => import('./components/ApisCards').then(m => <m.HasApisCard />),
});

const ApiDocsConsumingComponentsEntityCard = createEntityCardExtension({
  name: 'consuming-components',
  // Ommiting configSchema for now
  // we are skipping variations, see: https://github.com/backstage/backstage/pull/22619#discussion_r1477333252
  loader: () =>
    import('./components/ComponentsCards').then(m => (
      <m.ConsumingComponentsCard />
    )),
});

export default createPlugin({
  id: 'api-docs',
  routes: {
    root: convertLegacyRouteRef(rootRoute),
  },
  externalRoutes: {
    registerApi: convertLegacyRouteRef(registerComponentRouteRef),
  },
  extensions: [
    ApiDocsConfigApi,
    ApiDocsExplorerPage,
    ApiDocsHasApisEntityCard,
    ApiDocsDefinitionEntityCard,
    ApiDocsConsumedApisEntityCard,
    ApiDocsConsumingComponentsEntityCard,
  ],
});

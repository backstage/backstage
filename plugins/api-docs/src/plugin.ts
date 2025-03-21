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

import { ApiEntity } from '@backstage/catalog-model';
import { defaultDefinitionWidgets } from './components/ApiDefinitionCard';
import { apiDocsConfigRef } from './config';
import { registerComponentRouteRef, rootRoute } from './routes';
import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';

/** @public */
export const apiDocsPlugin = createPlugin({
  id: 'api-docs',
  routes: {
    root: rootRoute,
  },
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
  externalRoutes: {
    registerApi: registerComponentRouteRef,
  },
});

/** @public */
export const ApiExplorerPage = apiDocsPlugin.provide(
  createRoutableExtension({
    name: 'ApiExplorerPage',
    component: () =>
      import('./components/ApiExplorerPage').then(m => m.ApiExplorerIndexPage),
    mountPoint: rootRoute,
  }),
);

/** @public */
export const EntityApiDefinitionCard = apiDocsPlugin.provide(
  createComponentExtension({
    name: 'EntityApiDefinitionCard',
    component: {
      lazy: () =>
        import('./components/ApiDefinitionCard').then(m => m.ApiDefinitionCard),
    },
  }),
);

/** @public */
export const EntityConsumedApisCard = apiDocsPlugin.provide(
  createComponentExtension({
    name: 'EntityConsumedApisCard',
    component: {
      lazy: () =>
        import('./components/ApisCards').then(m => m.ConsumedApisCard),
    },
  }),
);

/** @public */
export const EntityConsumingComponentsCard = apiDocsPlugin.provide(
  createComponentExtension({
    name: 'EntityConsumingComponentsCard',
    component: {
      lazy: () =>
        import('./components/ComponentsCards').then(
          m => m.ConsumingComponentsCard,
        ),
    },
  }),
);

/** @public */
export const EntityProvidedApisCard = apiDocsPlugin.provide(
  createComponentExtension({
    name: 'EntityProvidedApisCard',
    component: {
      lazy: () =>
        import('./components/ApisCards').then(m => m.ProvidedApisCard),
    },
  }),
);

/** @public */
export const EntityProvidingComponentsCard = apiDocsPlugin.provide(
  createComponentExtension({
    name: 'EntityProvidingComponentsCard',
    component: {
      lazy: () =>
        import('./components/ComponentsCards').then(
          m => m.ProvidingComponentsCard,
        ),
    },
  }),
);

/** @public */
export const EntityHasApisCard = apiDocsPlugin.provide(
  createComponentExtension({
    name: 'EntityHasApisCard',
    component: {
      lazy: () => import('./components/ApisCards').then(m => m.HasApisCard),
    },
  }),
);

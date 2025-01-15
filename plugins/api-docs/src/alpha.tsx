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
import Grid from '@material-ui/core/Grid';

import {
  ApiBlueprint,
  NavItemBlueprint,
  PageBlueprint,
  createApiFactory,
  createFrontendPlugin,
} from '@backstage/frontend-plugin-api';

import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';

import {
  ApiEntity,
  parseEntityRef,
  RELATION_HAS_PART,
} from '@backstage/catalog-model';

import { defaultDefinitionWidgets } from './components/ApiDefinitionCard';
import { rootRoute, registerComponentRouteRef } from './routes';
import { apiDocsConfigRef } from './config';
import { AppIcon } from '@backstage/core-components';

import {
  EntityCardBlueprint,
  EntityContentBlueprint,
} from '@backstage/plugin-catalog-react/alpha';

const apiDocsNavItem = NavItemBlueprint.make({
  params: {
    title: 'APIs',
    routeRef: convertLegacyRouteRef(rootRoute),
    icon: () => compatWrapper(<AppIcon id="kind:api" />),
  },
});

const apiDocsConfigApi = ApiBlueprint.make({
  name: 'config',
  params: {
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
  },
});

const apiDocsExplorerPage = PageBlueprint.makeWithOverrides({
  config: {
    schema: {
      // Ommiting columns and actions for now as their types are too complex to map to zod
      initiallySelectedFilter: z =>
        z.enum(['owned', 'starred', 'all']).optional(),
    },
  },
  factory(originalFactory, { config }) {
    return originalFactory({
      defaultPath: '/api-docs',
      routeRef: convertLegacyRouteRef(rootRoute),
      loader: () =>
        import('./components/ApiExplorerPage').then(m =>
          compatWrapper(
            <m.ApiExplorerIndexPage
              initiallySelectedFilter={config.initiallySelectedFilter}
            />,
          ),
        ),
    });
  },
});

const apiDocsHasApisEntityCard = EntityCardBlueprint.make({
  name: 'has-apis',
  params: {
    // Ommiting configSchema for now
    // We are skipping variants and columns are too complex to map to zod
    // See: https://github.com/backstage/backstage/pull/22619#discussion_r1477333252
    filter: entity => {
      return (
        entity.kind === 'Component' &&
        entity.relations?.some(
          ({ type, targetRef }) =>
            type.toLocaleLowerCase('en-US') === RELATION_HAS_PART &&
            parseEntityRef(targetRef).kind === 'API',
        )!!
      );
    },
    loader: () =>
      import('./components/ApisCards').then(m =>
        compatWrapper(<m.HasApisCard />),
      ),
  },
});

const apiDocsDefinitionEntityCard = EntityCardBlueprint.make({
  name: 'definition',
  params: {
    filter: 'kind:api',
    loader: () =>
      import('./components/ApiDefinitionCard').then(m =>
        compatWrapper(<m.ApiDefinitionCard />),
      ),
  },
});

const apiDocsConsumedApisEntityCard = EntityCardBlueprint.make({
  name: 'consumed-apis',
  params: {
    // Ommiting configSchema for now
    // We are skipping variants and columns are too complex to map to zod
    // See: https://github.com/backstage/backstage/pull/22619#discussion_r1477333252
    filter: 'kind:component',
    loader: () =>
      import('./components/ApisCards').then(m =>
        compatWrapper(<m.ConsumedApisCard />),
      ),
  },
});

const apiDocsProvidedApisEntityCard = EntityCardBlueprint.make({
  name: 'provided-apis',
  params: {
    // Ommiting configSchema for now
    // We are skipping variants and columns are too complex to map to zod
    // See: https://github.com/backstage/backstage/pull/22619#discussion_r1477333252
    filter: 'kind:component',
    loader: () =>
      import('./components/ApisCards').then(m =>
        compatWrapper(<m.ProvidedApisCard />),
      ),
  },
});

const apiDocsConsumingComponentsEntityCard = EntityCardBlueprint.make({
  name: 'consuming-components',
  params: {
    // Ommiting configSchema for now
    // We are skipping variants
    // See: https://github.com/backstage/backstage/pull/22619#discussion_r1477333252
    filter: 'kind:api',
    loader: () =>
      import('./components/ComponentsCards').then(m =>
        compatWrapper(<m.ConsumingComponentsCard />),
      ),
  },
});

const apiDocsProvidingComponentsEntityCard = EntityCardBlueprint.make({
  name: 'providing-components',
  params: {
    // Ommiting configSchema for now
    // We are skipping variants
    // See: https://github.com/backstage/backstage/pull/22619#discussion_r1477333252
    filter: 'kind:api',
    loader: () =>
      import('./components/ComponentsCards').then(m =>
        compatWrapper(<m.ProvidingComponentsCard />),
      ),
  },
});

const apiDocsDefinitionEntityContent = EntityContentBlueprint.make({
  name: 'definition',
  params: {
    defaultPath: '/definition',
    defaultTitle: 'Definition',
    filter: 'kind:api',
    loader: async () =>
      import('./components/ApiDefinitionCard').then(m =>
        compatWrapper(
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <m.ApiDefinitionCard />
            </Grid>
          </Grid>,
        ),
      ),
  },
});

const apiDocsApisEntityContent = EntityContentBlueprint.make({
  name: 'apis',
  params: {
    defaultPath: '/apis',
    defaultTitle: 'APIs',
    filter: 'kind:component',
    loader: async () =>
      import('./components/ApisCards').then(m =>
        compatWrapper(
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12}>
              <m.ProvidedApisCard />
            </Grid>
            <Grid item xs={12}>
              <m.ConsumedApisCard />
            </Grid>
          </Grid>,
        ),
      ),
  },
});

export default createFrontendPlugin({
  id: 'api-docs',
  routes: {
    root: convertLegacyRouteRef(rootRoute),
  },
  externalRoutes: {
    registerApi: convertLegacyRouteRef(registerComponentRouteRef),
  },
  extensions: [
    apiDocsNavItem,
    apiDocsConfigApi,
    apiDocsExplorerPage,
    apiDocsHasApisEntityCard,
    apiDocsDefinitionEntityCard,
    apiDocsProvidedApisEntityCard,
    apiDocsConsumedApisEntityCard,
    apiDocsConsumingComponentsEntityCard,
    apiDocsProvidingComponentsEntityCard,
    apiDocsDefinitionEntityContent,
    apiDocsApisEntityContent,
  ],
});

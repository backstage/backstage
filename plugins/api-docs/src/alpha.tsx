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
import { Grid } from '@material-ui/core';

import {
  createApiExtension,
  createApiFactory,
  createNavItemExtension,
  createPageExtension,
  createPlugin,
  createSchemaFromZod,
} from '@backstage/frontend-plugin-api';

import {
  SystemIcon,
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';

import {
  createEntityCardExtension,
  createEntityContentExtension,
} from '@backstage/plugin-catalog-react/alpha';
import {
  ApiEntity,
  parseEntityRef,
  RELATION_HAS_PART,
} from '@backstage/catalog-model';

import { defaultDefinitionWidgets } from './components/ApiDefinitionCard';
import { rootRoute, registerComponentRouteRef } from './routes';
import { apiDocsConfigRef } from './config';

const apiDocsNavItem = createNavItemExtension({
  title: 'APIs',
  routeRef: convertLegacyRouteRef(rootRoute),
  icon: () => <SystemIcon id="kind:api" />,
});

const apiDocsConfigApi = createApiExtension({
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

const apiDocsExplorerPage = createPageExtension({
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
  loader: ({ config }) =>
    import('./components/ApiExplorerPage').then(m =>
      compatWrapper(
        <m.ApiExplorerIndexPage
          initiallySelectedFilter={config.initiallySelectedFilter}
        />,
      ),
    ),
});

const apiDocsHasApisEntityCard = createEntityCardExtension({
  name: 'has-apis',
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
});

const apiDocsDefinitionEntityCard = createEntityCardExtension({
  name: 'definition',
  filter: 'kind:api',
  loader: () =>
    import('./components/ApiDefinitionCard').then(m =>
      compatWrapper(<m.ApiDefinitionCard />),
    ),
});

const apiDocsConsumedApisEntityCard = createEntityCardExtension({
  name: 'consumed-apis',
  // Ommiting configSchema for now
  // We are skipping variants and columns are too complex to map to zod
  // See: https://github.com/backstage/backstage/pull/22619#discussion_r1477333252
  filter: 'kind:component',
  loader: () =>
    import('./components/ApisCards').then(m =>
      compatWrapper(<m.ConsumedApisCard />),
    ),
});

const apiDocsProvidedApisEntityCard = createEntityCardExtension({
  name: 'provided-apis',
  // Ommiting configSchema for now
  // We are skipping variants and columns are too complex to map to zod
  // See: https://github.com/backstage/backstage/pull/22619#discussion_r1477333252
  filter: 'kind:component',
  loader: () =>
    import('./components/ApisCards').then(m =>
      compatWrapper(<m.ProvidedApisCard />),
    ),
});

const apiDocsConsumingComponentsEntityCard = createEntityCardExtension({
  name: 'consuming-components',
  // Ommiting configSchema for now
  // We are skipping variants
  // See: https://github.com/backstage/backstage/pull/22619#discussion_r1477333252
  filter: 'kind:api',
  loader: () =>
    import('./components/ComponentsCards').then(m =>
      compatWrapper(<m.ConsumingComponentsCard />),
    ),
});

const apiDocsProvidingComponentsEntityCard = createEntityCardExtension({
  name: 'providing-components',
  // Ommiting configSchema for now
  // We are skipping variants
  // See: https://github.com/backstage/backstage/pull/22619#discussion_r1477333252
  filter: 'kind:api',
  loader: () =>
    import('./components/ComponentsCards').then(m =>
      compatWrapper(<m.ProvidingComponentsCard />),
    ),
});

const apiDocsDefinitionEntityContent = createEntityContentExtension({
  name: 'definition',
  defaultPath: '/defintion',
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
});

const apiDocsApisEntityContent = createEntityContentExtension({
  name: 'apis',
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

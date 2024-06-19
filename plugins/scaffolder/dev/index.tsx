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

import { createDevApp } from '@backstage/dev-utils';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import {
  starredEntitiesApiRef,
  MockStarredEntitiesApi,
} from '@backstage/plugin-catalog-react';
import React from 'react';
import { ScaffolderClient } from '../src';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { ScaffolderPage } from '../src/plugin';
import {
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { CatalogEntityPage, catalogPlugin } from '@backstage/plugin-catalog';

createDevApp()
  .registerPlugin(catalogPlugin)
  .registerApi({
    api: starredEntitiesApiRef,
    deps: {},
    factory: () => new MockStarredEntitiesApi(),
  })
  .registerApi({
    api: scaffolderApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      fetchApi: fetchApiRef,
      scmIntegrationsApi: scmIntegrationsApiRef,
      identityApi: identityApiRef,
    },
    factory: ({ discoveryApi, fetchApi, scmIntegrationsApi, identityApi }) =>
      new ScaffolderClient({
        discoveryApi,
        fetchApi,
        scmIntegrationsApi,
        identityApi,
      }),
  })
  .addPage({
    path: '/catalog/:kind/:namespace/:name',
    element: <CatalogEntityPage />,
  })
  .addPage({
    path: '/create',
    title: 'Create',
    element: <ScaffolderPage />,
  })
  .addPage({
    path: '/create-groups',
    title: 'Groups',
    element: (
      <ScaffolderPage
        groups={[
          {
            filter: e => e.metadata.tags?.includes('techdocs') || false,
            title: 'Techdocs',
          },
          {
            filter: e => e.metadata.tags?.includes('react') || false,
            title: 'React',
          },
        ]}
      />
    ),
  })
  .render();

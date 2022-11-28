/*
 * Copyright 2021 The Backstage Authors
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

import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import {
  ConfigApi,
  configApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import {
  CatalogApi,
  catalogApiRef,
  starredEntitiesApiRef,
  MockEntityListContextProvider,
  MockStarredEntitiesApi,
} from '@backstage/plugin-catalog-react';
import {
  MockStorageApi,
  renderInTestApp,
  TestApiRegistry,
} from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { rootDocsRouteRef } from '../../../routes';
import { EntityListDocsGrid } from './EntityListDocsGrid';

const entities = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'Documentation #1',
      namespace: 'default',
    },
    spec: {
      type: 'documentation',
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'Documentation #2',
      namespace: 'default',
    },
    spec: {
      type: 'documentation',
    },
  },
];

const mockCatalogApi = {
  getEntityByRef: () => Promise.resolve(),
  getEntities: async () => ({
    items: entities,
  }),
} as Partial<CatalogApi>;

describe('Entity List Docs Grid', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const configApi: ConfigApi = new ConfigReader({
    organization: {
      name: 'My Company',
    },
  });

  const storageApi = MockStorageApi.create();

  const apiRegistry = TestApiRegistry.from(
    [catalogApiRef, mockCatalogApi],
    [configApiRef, configApi],
    [storageApiRef, storageApi],
    [starredEntitiesApiRef, new MockStarredEntitiesApi()],
  );

  it('should render all entitites without filtering', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <MockEntityListContextProvider value={{ entities: entities }}>
          <EntityListDocsGrid />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/docs/:namespace/:kind/:name/*': rootDocsRouteRef,
        },
      },
    );

    expect(screen.getByText('All Documentation')).toBeInTheDocument();
    expect(screen.getByText('Documentation #1')).toBeInTheDocument();
    expect(screen.getByText('Documentation #2')).toBeInTheDocument();
    expect(screen.queryByTestId('doc-not-found')).not.toBeInTheDocument();
  });

  it('should render only filtered entities with filtering', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <MockEntityListContextProvider value={{ entities: entities }}>
          <EntityListDocsGrid
            groups={[
              {
                title: 'Curated Documentation',
                filterPredicate: entity =>
                  entity.metadata.name === 'Documentation #1',
              },
            ]}
          />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/docs/:namespace/:kind/:name/*': rootDocsRouteRef,
        },
      },
    );

    expect(screen.getByText('Curated Documentation')).toBeInTheDocument();
    expect(screen.getByText('Documentation #1')).toBeInTheDocument();
    expect(screen.queryByText('Documentation #2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('doc-not-found')).not.toBeInTheDocument();
  });

  it('should render nothing with filtering yielding no result', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <MockEntityListContextProvider value={{ entities: entities }}>
          <EntityListDocsGrid
            groups={[
              {
                title: 'Curated Documentation',
                filterPredicate: entity =>
                  entity.metadata.name === 'Documentation #3',
              },
            ]}
          />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/docs/:namespace/:kind/:name/*': rootDocsRouteRef,
        },
      },
    );

    expect(screen.queryByText('Curated Documentation')).not.toBeInTheDocument();
    expect(screen.queryByText('Documentation #1')).not.toBeInTheDocument();
    expect(screen.queryByText('Documentation #2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('doc-not-found')).not.toBeInTheDocument();
  });

  it('should render an error without any documentation and without filtering', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <MockEntityListContextProvider value={{ entities: [] }}>
          <EntityListDocsGrid />
        </MockEntityListContextProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/docs/:namespace/:kind/:name/*': rootDocsRouteRef,
        },
      },
    );

    expect(screen.queryByText('All Documentation')).not.toBeInTheDocument();
    expect(screen.queryByText('Documentation #1')).not.toBeInTheDocument();
    expect(screen.queryByText('Documentation #2')).not.toBeInTheDocument();
    expect(screen.getByTestId('doc-not-found')).toBeInTheDocument();
  });
});

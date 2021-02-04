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

import {
  Entity,
  RELATION_API_CONSUMED_BY,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import { ApiProvider, ApiRegistry } from '@backstage/core';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { ConsumingComponentsCard } from './ConsumingComponentsCard';

describe('<ConsumingComponentsCard />', () => {
  const catalogApi: jest.Mocked<CatalogApi> = {
    getLocationById: jest.fn(),
    getEntityByName: jest.fn(),
    getEntities: jest.fn(),
    addLocation: jest.fn(),
    getLocationByEntity: jest.fn(),
    removeEntityByUid: jest.fn(),
  } as any;
  let Wrapper: React.ComponentType;

  beforeEach(() => {
    const apis = ApiRegistry.with(catalogApiRef, catalogApi);

    Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <ApiProvider apis={apis}>{children}</ApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('shows empty list if no relations', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'API',
      metadata: {
        name: 'my-name',
        namespace: 'my-namespace',
      },
      spec: {
        type: 'openapi',
        owner: 'Test',
        lifecycle: 'production',
        definition: '...',
      },
      relations: [],
    };

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <ConsumingComponentsCard />
        </EntityProvider>
      </Wrapper>,
    );

    expect(getByText(/Consumers/i)).toBeInTheDocument();
    expect(getByText(/No APIs consumed by this entity/i)).toBeInTheDocument();
  });

  it('shows consuming components', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'API',
      metadata: {
        name: 'my-name',
        namespace: 'my-namespace',
      },
      spec: {
        type: 'openapi',
        owner: 'Test',
        lifecycle: 'production',
        definition: '...',
      },
      relations: [
        {
          target: {
            kind: 'Component',
            namespace: 'my-namespace',
            name: 'target-name',
          },
          type: RELATION_API_CONSUMED_BY,
        },
      ],
    };
    catalogApi.getEntityByName.mockResolvedValue({
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'target-name',
        namespace: 'my-namespace',
      },
      spec: {
        type: 'service',
        lifecycle: 'production',
      },
      relations: [
        {
          type: RELATION_PART_OF,
          target: {
            kind: 'System',
            name: 'MySystem',
            namespace: 'default',
          },
        },
        {
          type: RELATION_OWNED_BY,
          target: {
            kind: 'Group',
            name: 'Test',
            namespace: 'default',
          },
        },
      ],
    });

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <ConsumingComponentsCard />
        </EntityProvider>
      </Wrapper>,
    );

    await waitFor(() => {
      expect(getByText(/Consumers/i)).toBeInTheDocument();
      expect(getByText(/target-name/i)).toBeInTheDocument();
      expect(getByText(/Test/i)).toBeInTheDocument();
      expect(getByText(/MySystem/i)).toBeInTheDocument();
      expect(getByText(/production/i)).toBeInTheDocument();
    });
  });
});

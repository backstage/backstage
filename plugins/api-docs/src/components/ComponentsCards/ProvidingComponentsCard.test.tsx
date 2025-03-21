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

import { Entity, RELATION_API_PROVIDED_BY } from '@backstage/catalog-model';
import {
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { ProvidingComponentsCard } from './ProvidingComponentsCard';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

describe('<ProvidingComponentsCard />', () => {
  const catalogApi = catalogApiMock.mock();
  let Wrapper: React.ComponentType<React.PropsWithChildren<{}>>;

  beforeEach(() => {
    Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        {children}
      </TestApiProvider>
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
          <ProvidingComponentsCard />
        </EntityProvider>
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(getByText('Providers')).toBeInTheDocument();
    expect(getByText(/No component provides this API/i)).toBeInTheDocument();
  });

  it('shows providing components', async () => {
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
          targetRef: 'component:my-namespace/target-name',
          type: RELATION_API_PROVIDED_BY,
        },
      ],
    };
    catalogApi.getEntitiesByRefs.mockResolvedValue({
      items: [
        {
          apiVersion: 'v1',
          kind: 'Component',
          metadata: {
            name: 'target-name',
            namespace: 'my-namespace',
          },
          spec: {},
        },
      ],
    });

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <ProvidingComponentsCard />
        </EntityProvider>
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    await waitFor(() => {
      expect(getByText('Providers')).toBeInTheDocument();
      expect(getByText(/target-name/i)).toBeInTheDocument();
    });
  });
});

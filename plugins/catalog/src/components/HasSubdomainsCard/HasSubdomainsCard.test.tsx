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

import { Entity, RELATION_HAS_PART } from '@backstage/catalog-model';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { waitFor, screen } from '@testing-library/react';
import React from 'react';
import { HasSubdomainsCard } from './HasSubdomainsCard';

describe('<HasSubdomainsCard />', () => {
  const getEntitiesByRefs: jest.MockedFunction<
    CatalogApi['getEntitiesByRefs']
  > = jest.fn();
  let Wrapper: React.ComponentType<React.PropsWithChildren<{}>>;

  beforeEach(() => {
    Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <TestApiProvider apis={[[catalogApiRef, { getEntitiesByRefs }]]}>
        {children}
      </TestApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('shows empty list if no relations', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Domain',
      metadata: {
        name: 'my-domain',
        namespace: 'my-namespace',
      },
      relations: [],
    };

    await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <HasSubdomainsCard />
        </EntityProvider>
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(screen.getByText('Has subdomains')).toBeInTheDocument();
    expect(
      screen.getByText(/No subdomain is part of this domain/i),
    ).toBeInTheDocument();
  });

  it('shows related subdomains', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'Domain',
      metadata: {
        name: 'my-domain',
        namespace: 'my-namespace',
      },
      relations: [
        {
          targetRef: 'domain:my-namespace/target-name',
          type: RELATION_HAS_PART,
        },
      ],
    };
    getEntitiesByRefs.mockResolvedValue({
      items: [
        {
          apiVersion: 'v1',
          kind: 'Domain',
          metadata: {
            name: 'target-name',
            namespace: 'my-namespace',
          },
          spec: {},
        },
      ],
    });

    await renderInTestApp(
      <Wrapper>
        <EntityProvider entity={entity}>
          <HasSubdomainsCard />
        </EntityProvider>
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    await waitFor(() => {
      expect(screen.getByText('Has subdomains')).toBeInTheDocument();
      expect(screen.getByText(/target-name/i)).toBeInTheDocument();
    });
  });
});

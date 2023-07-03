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

import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { entityRouteRef } from '../../routes';
import { EntityRefLinks } from './EntityRefLinks';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';

describe('<EntityRefLinks />', () => {
  const catalogApi: jest.Mocked<CatalogApi> = {
    getLocationById: jest.fn(),
    getEntityByName: jest.fn(),
    getEntityByRef: jest.fn(),
    getEntities: jest.fn(),
    addLocation: jest.fn(),
    getLocationByRef: jest.fn(),
    removeEntityByUid: jest.fn(),
    refreshEntity: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a single link', async () => {
    const entityNames = [
      {
        kind: 'Component',
        namespace: 'default',
        name: 'software',
      },
    ];
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      spec: {},
    };

    catalogApi.getEntityByRef.mockResolvedValueOnce(entity);
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <EntityRefLinks entityRefs={entityNames} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );
    expect(screen.getByText('component:software')).toHaveAttribute(
      'href',
      '/catalog/default/component/software',
    );
  });

  it('renders multiple links', async () => {
    const entityNames = [
      {
        kind: 'Component',
        namespace: 'default',
        name: 'software',
      },
      {
        kind: 'API',
        namespace: 'default',
        name: 'interface',
      },
    ];
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
      },
      spec: {},
    };
    const entity2 = {
      apiVersion: 'v1',
      kind: 'API',
      metadata: {
        name: 'interface',
      },
      spec: {},
    };

    catalogApi.getEntityByRef
      .mockResolvedValueOnce(entity)
      .mockResolvedValueOnce(entity2);
    await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <EntityRefLinks entityRefs={entityNames} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );
    expect(screen.getByText(',')).toBeInTheDocument();
    expect(screen.getByText('component:software')).toHaveAttribute(
      'href',
      '/catalog/default/component/software',
    );
    expect(screen.getByText('api:interface')).toHaveAttribute(
      'href',
      '/catalog/default/api/interface',
    );
  });
});

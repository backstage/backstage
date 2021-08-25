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

import { GroupEntity } from '@backstage/catalog-model';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
  catalogRouteRef,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { queryByText } from '@testing-library/react';
import React from 'react';
import { OwnershipCard } from './OwnershipCard';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';

describe('OwnershipCard', () => {
  const userEntity: GroupEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      name: 'my-team',
    },
    spec: {
      type: 'team',
      children: [],
    },
    relations: [
      {
        type: 'memberOf',
        target: {
          kind: 'group',
          name: 'ExampleGroup',
          namespace: 'default',
        },
      },
    ],
  };

  it('displays entity counts', async () => {
    const catalogApi: jest.Mocked<CatalogApi> = {
      getEntities: jest.fn(),
    } as any;

    catalogApi.getEntities.mockResolvedValue({
      items: [
        {
          kind: 'API',
          metadata: {
            name: 'my-api',
          },
          spec: {
            type: 'openapi',
          },
          relations: [
            {
              type: 'ownedBy',
              target: {
                name: 'my-team',
                namespace: 'default',
                kind: 'Group',
              },
            },
          ],
        },
        {
          kind: 'Component',
          metadata: {
            name: 'my-service',
          },
          spec: {
            type: 'service',
          },
          relations: [
            {
              type: 'ownedBy',
              target: {
                name: 'my-team',
                namespace: 'default',
                kind: 'Group',
              },
            },
          ],
        },
        {
          kind: 'Component',
          metadata: {
            name: 'my-library',
            namespace: 'other-namespace',
          },
          spec: {
            type: 'library',
          },
          relations: [
            {
              type: 'ownedBy',
              target: {
                name: 'my-team',
                namespace: 'default',
                kind: 'Group',
              },
            },
          ],
        },
      ] as any,
    });

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={ApiRegistry.with(catalogApiRef, catalogApi)}>
        <EntityProvider entity={userEntity}>
          <OwnershipCard />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create': catalogRouteRef,
        },
      },
    );

    expect(getByText('OPENAPI')).toBeInTheDocument();
    expect(
      queryByText(getByText('OPENAPI').parentElement!, '1'),
    ).toBeInTheDocument();
    expect(getByText('SERVICE')).toBeInTheDocument();
    expect(
      queryByText(getByText('SERVICE').parentElement!, '1'),
    ).toBeInTheDocument();
    expect(getByText('LIBRARY')).toBeInTheDocument();
    expect(
      queryByText(getByText('LIBRARY').parentElement!, '1'),
    ).toBeInTheDocument();
  });
});

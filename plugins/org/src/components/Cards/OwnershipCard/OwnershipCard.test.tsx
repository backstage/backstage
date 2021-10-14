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

import { GroupEntity, UserEntity } from '@backstage/catalog-model';
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
  const groupEntity: GroupEntity = {
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

  const items = [
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
  ] as any;

  it('displays entity counts', async () => {
    const catalogApi: jest.Mocked<CatalogApi> = {
      getEntities: jest.fn(),
    } as any;

    catalogApi.getEntities.mockResolvedValue({
      items,
    });

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={ApiRegistry.with(catalogApiRef, catalogApi)}>
        <EntityProvider entity={groupEntity}>
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

  it('links to the catalog with the group filter', async () => {
    const catalogApi: jest.Mocked<CatalogApi> = {
      getEntities: jest.fn(),
    } as any;

    catalogApi.getEntities.mockResolvedValue({
      items,
    });

    const { getByText } = await renderInTestApp(
      <ApiProvider apis={ApiRegistry.with(catalogApiRef, catalogApi)}>
        <EntityProvider entity={groupEntity}>
          <OwnershipCard />
        </EntityProvider>
      </ApiProvider>,
      {
        mountedRoutes: {
          '/create': catalogRouteRef,
        },
      },
    );

    expect(getByText('OPENAPI').closest('a')).toHaveAttribute(
      'href',
      '/create/?filters%5Bkind%5D=API&filters%5Btype%5D=openapi&filters%5Bowners%5D%5B0%5D=my-team&filters%5Buser%5D=all',
    );
  });

  it('links to the catalog with the user and groups filters from an user profile', async () => {
    const userEntity: UserEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: 'the-user',
      },
      spec: {
        memberOf: ['my-team'],
      },
      relations: [
        {
          type: 'memberOf',
          target: {
            kind: 'Group',
            name: 'my-team',
            namespace: 'default',
          },
        },
      ],
    };
    const catalogApi: jest.Mocked<CatalogApi> = {
      getEntities: jest.fn(),
    } as any;

    catalogApi.getEntities.mockResolvedValue({
      items,
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

    expect(getByText('OPENAPI').closest('a')).toHaveAttribute(
      'href',
      '/create/?filters%5Bkind%5D=API&filters%5Btype%5D=openapi&filters%5Bowners%5D%5B0%5D=user%3Athe-user&filters%5Bowners%5D%5B1%5D=my-team&filters%5Buser%5D=all',
    );
  });
});

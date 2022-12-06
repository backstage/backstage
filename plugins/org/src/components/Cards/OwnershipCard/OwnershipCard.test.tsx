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

import {
  GetEntitiesRequest,
  GetEntitiesResponse,
} from '@backstage/catalog-client';
import { Entity, GroupEntity, UserEntity } from '@backstage/catalog-model';
import {
  CatalogApi,
  catalogApiRef,
  EntityProvider,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { queryByText } from '@testing-library/react';
import React from 'react';
import { catalogIndexRouteRef } from '../../../routes';
import { OwnershipCard } from './OwnershipCard';

const items = [
  {
    apiVersion: 'backstage.io/v1alpha1',
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
        targetRef: 'group:default/my-team',
        target: {
          name: 'my-team',
          namespace: 'default',
          kind: 'group',
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
        targetRef: 'group:default/my-team',
        target: {
          name: 'my-team',
          namespace: 'default',
          kind: 'group',
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
        targetRef: 'group:default/my-team',
        target: {
          name: 'my-team',
          namespace: 'default',
          kind: 'group',
        },
      },
    ],
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'System',
    metadata: {
      name: 'my-system',
    },
    relations: [
      {
        type: 'ownedBy',
        targetRef: 'group:default/my-team',
      },
    ],
  },
] as Entity[];

const getEntitiesMock = (
  request?: GetEntitiesRequest,
): Promise<GetEntitiesResponse> => {
  const filterKinds =
    Array.isArray(request?.filter) && Array.isArray(request?.filter[0].kind)
      ? request?.filter[0].kind ?? []
      : []; // we expect the request to be like { filter: [{ kind: ['API','System'], 'relations.ownedBy': [group:default/my-team], .... }]. If changed in OwnerShipCard, let's change in also here
  return Promise.resolve({
    items: items.filter(item => filterKinds.find(k => k === item.kind)),
  } as GetEntitiesResponse);
};

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
        targetRef: 'group:default/examplegroup',
      },
    ],
  };

  it('displays entity counts', async () => {
    const catalogApi: jest.Mocked<CatalogApi> = {
      getEntities: jest.fn(),
    } as any;

    catalogApi.getEntities.mockImplementation(getEntitiesMock);

    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <EntityProvider entity={groupEntity}>
          <OwnershipCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/create': catalogIndexRouteRef,
        },
      },
    );

    expect(catalogApi.getEntities).toHaveBeenCalledWith({
      filter: [
        {
          kind: ['Component', 'API', 'System'],
          'relations.ownedBy': ['group:default/my-team'],
        },
      ],
      fields: [
        'kind',
        'metadata.name',
        'metadata.namespace',
        'spec.type',
        'relations',
      ],
    });

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
    expect(getByText('SYSTEM')).toBeInTheDocument();
    expect(
      queryByText(getByText('SYSTEM').parentElement!, '1'),
    ).toBeInTheDocument();
  });

  it('applies CustomFilterDefinition', async () => {
    const catalogApi: jest.Mocked<CatalogApi> = {
      getEntities: jest.fn(),
    } as any;

    catalogApi.getEntities.mockImplementation(getEntitiesMock);

    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <EntityProvider entity={groupEntity}>
          <OwnershipCard entityFilterKind={['API', 'System']} />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/create': catalogIndexRouteRef,
        },
      },
    );

    expect(getByText('SYSTEM')).toBeInTheDocument();
    expect(
      queryByText(getByText('SYSTEM').parentElement!, '1'),
    ).toBeInTheDocument();
    expect(
      queryByText(getByText('SYSTEM').parentElement!, 'System'),
    ).not.toBeInTheDocument();
    expect(getByText('OPENAPI')).toBeInTheDocument();
    expect(
      queryByText(getByText('OPENAPI').parentElement!, '1'),
    ).toBeInTheDocument();
    expect(
      queryByText(getByText('OPENAPI').parentElement!, 'API'),
    ).toBeInTheDocument();
    expect(() => getByText('LIBRARY')).toThrow();
  });

  it('links to the catalog with the group filter', async () => {
    const catalogApi: jest.Mocked<CatalogApi> = {
      getEntities: jest.fn(),
    } as any;

    catalogApi.getEntities.mockImplementation(getEntitiesMock);

    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <EntityProvider entity={groupEntity}>
          <OwnershipCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/create': catalogIndexRouteRef,
        },
      },
    );

    expect(getByText('OPENAPI').closest('a')).toHaveAttribute(
      'href',
      '/create/?filters%5Bkind%5D=api&filters%5Btype%5D=openapi&filters%5Bowners%5D=my-team&filters%5Buser%5D=all',
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
          targetRef: 'group:default/my-team',
        },
        {
          type: 'memberOf',
          targetRef: 'group:custom/some-team',
        },
      ],
    };
    const catalogApi: jest.Mocked<CatalogApi> = {
      getEntities: jest.fn(),
    } as any;

    catalogApi.getEntities.mockImplementation(getEntitiesMock);

    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <EntityProvider entity={userEntity}>
          <OwnershipCard />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/create': catalogIndexRouteRef,
        },
      },
    );

    expect(getByText('OPENAPI').closest('a')).toHaveAttribute(
      'href',
      '/create/?filters%5Bkind%5D=api&filters%5Btype%5D=openapi&filters%5Bowners%5D=user%3Athe-user&filters%5Bowners%5D=my-team&filters%5Bowners%5D=custom%2Fsome-team&filters%5Buser%5D=all',
    );
  });

  describe('OwnershipCard relations', () => {
    it('shows relations toggle', async () => {
      const catalogApi: jest.Mocked<CatalogApi> = {
        getEntities: jest.fn(),
      } as any;

      catalogApi.getEntities.mockImplementation(getEntitiesMock);

      const { getByTitle } = await renderInTestApp(
        <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
          <EntityProvider entity={groupEntity}>
            <OwnershipCard />
          </EntityProvider>
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/create': catalogIndexRouteRef,
          },
        },
      );

      expect(getByTitle('Direct Relations')).toBeInTheDocument();
    });

    it('hides relations toggle', async () => {
      const catalogApi: jest.Mocked<CatalogApi> = {
        getEntities: jest.fn(),
      } as any;

      catalogApi.getEntities.mockImplementation(getEntitiesMock);

      const rendered = await renderInTestApp(
        <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
          <EntityProvider entity={groupEntity}>
            <OwnershipCard hideRelationsToggle />
          </EntityProvider>
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/create': catalogIndexRouteRef,
          },
        },
      );

      expect(rendered.queryByText('Direct Relations')).toBeNull();
    });
    it('overrides relation type', async () => {
      const catalogApi: jest.Mocked<CatalogApi> = {
        getEntities: jest.fn(),
      } as any;

      catalogApi.getEntities.mockImplementation(getEntitiesMock);

      const { getByTitle } = await renderInTestApp(
        <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
          <EntityProvider entity={groupEntity}>
            <OwnershipCard relationsType="aggregated" />
          </EntityProvider>
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/create': catalogIndexRouteRef,
          },
        },
      );

      expect(getByTitle('Aggregated Relations')).toBeInTheDocument();
    });
  });
});

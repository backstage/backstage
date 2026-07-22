/*
 * Copyright 2022 The Backstage Authors
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
import { Entity } from '@backstage/catalog-model';
import {
  renderInTestApp,
  TestApiProvider,
  mockApis,
} from '@backstage/test-utils';
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { identityApiRef } from '@backstage/core-plugin-api';
import { InvokedTasks } from './InvokedTasks';
import { fireEvent } from '@testing-library/react';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  GoldenPathsApi,
  goldenPathsApiRef,
  rootRouteRef,
} from '@backstage/plugin-golden-paths-react';

describe('<InvokedTasks />', () => {
  const catalogApi = catalogApiMock.mock();

  const identityApi = mockApis.identity();

  const goldenPathsApiMock: jest.Mocked<Required<GoldenPathsApi>> = {
    getGoldenPathParameterSchema: jest.fn(),
    listTasks: jest.fn(),
  } as any;

  const mockPermissionApi = { authorize: jest.fn() };

  it('should render the page', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'service',
      metadata: {
        name: 'test',
      },
      spec: {
        profile: {
          displayName: 'BackUser',
        },
      },
    };
    catalogApi.getEntityByRef.mockResolvedValue(entity);

    goldenPathsApiMock.listTasks.mockResolvedValue({
      tasks: [],
      totalTasks: 0,
    });

    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [identityApiRef, identityApi],
          [goldenPathsApiRef, goldenPathsApiMock],
          [permissionApiRef, mockPermissionApi],
        ]}
      >
        <InvokedTasks />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/root': rootRouteRef,
        },
      },
    );

    expect(
      getByText('All Golden Paths that have been started'),
    ).toBeInTheDocument();
    expect(getByText('Invoked Golden Paths')).toBeInTheDocument();
  });

  it('should render the task I am owner', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'User',
      metadata: {
        name: 'foo',
      },
      spec: {
        profile: {
          displayName: 'BackUser',
        },
      },
    };
    catalogApi.getEntityByRef.mockResolvedValue(entity);
    goldenPathsApiMock.listTasks.mockResolvedValue({
      tasks: [
        {
          id: 'a-random-id',
          spec: {
            user: { ref: 'user:default/foo' },
            goldenPathInfo: {
              entityRef: 'goldenpath:default/test',
            },
          } as any,
          status: 'completed',
          createdAt: '',
        },
      ],
      totalTasks: 1,
    });

    goldenPathsApiMock.getGoldenPathParameterSchema.mockResolvedValue({
      title: 'One Golden Path',
      steps: [],
    });

    const { getByText, findByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [identityApiRef, identityApi],
          [goldenPathsApiRef, goldenPathsApiMock],
          [permissionApiRef, mockPermissionApi],
        ]}
      >
        <InvokedTasks />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/root': rootRouteRef,
        },
      },
    );

    expect(goldenPathsApiMock.listTasks).toHaveBeenCalledWith({
      filterByOwnership: 'owned',
      limit: 10,
      offset: 0,
    });
    expect(
      getByText('All Golden Paths that have been started'),
    ).toBeInTheDocument();
    expect(getByText('Invoked Golden Paths')).toBeInTheDocument();
    expect(await findByText('One Golden Path')).toBeInTheDocument();
    expect(await findByText('BackUser')).toBeInTheDocument();
  });

  it('should render all tasks', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'User',
      metadata: {
        name: 'foo',
      },
      spec: {
        profile: {
          displayName: 'BackUser',
        },
      },
    };
    catalogApi.getEntityByRef
      .mockResolvedValue(entity)
      .mockResolvedValue(entity)
      .mockResolvedValue({
        ...entity,
        spec: {
          profile: {
            displayName: 'OtherUser',
          },
        },
      });

    goldenPathsApiMock.listTasks
      .mockResolvedValue({
        tasks: [
          {
            id: 'a-random-id',
            spec: {
              user: { ref: 'user:default/foo' },
              goldenPathInfo: {
                entityRef: 'goldenpath:default/mock',
              },
            } as any,
            status: 'completed',
            createdAt: '',
          },
        ],
        totalTasks: 1,
      })
      .mockResolvedValue({
        tasks: [
          {
            id: 'b-random-id',
            spec: {
              goldenPathInfo: {
                entityRef: 'goldenpath:default/mock',
              },
              user: {
                ref: 'user:default/boo',
              },
            } as any,
            status: 'completed',
            createdAt: '',
          },
        ],
        totalTasks: 1,
      });

    goldenPathsApiMock.getGoldenPathParameterSchema.mockResolvedValue({
      title: 'One Golden Path',
      steps: [],
    });

    const { getByText, findByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [identityApiRef, identityApi],
          [goldenPathsApiRef, goldenPathsApiMock],
          [permissionApiRef, mockPermissionApi],
        ]}
      >
        <InvokedTasks />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/root': rootRouteRef,
        },
      },
    );
    const allButton = getByText('All');
    fireEvent.click(allButton);

    expect(goldenPathsApiMock.listTasks).toHaveBeenCalledWith({
      filterByOwnership: 'all',
      limit: 10,
      offset: 0,
    });
    expect(await findByText('One Golden Path')).toBeInTheDocument();
    expect(await findByText('OtherUser')).toBeInTheDocument();
  });
});

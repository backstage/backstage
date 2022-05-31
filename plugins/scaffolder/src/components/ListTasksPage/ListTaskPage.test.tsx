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
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import {
  CatalogApi,
  catalogApiRef,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import React from 'react';
import { identityApiRef } from '@backstage/core-plugin-api';
import { ListTasksPage } from './ListTasksPage';
import { ScaffolderApi } from '../../types';
import { scaffolderApiRef } from '../../api';
import { rootRouteRef } from '../../routes';
import { act, fireEvent } from '@testing-library/react';

describe('<ListTasksPage />', () => {
  const catalogApi: jest.Mocked<CatalogApi> = {
    getEntityByRef: jest.fn(),
  } as any;

  const identityApi = {
    getBackstageIdentity: jest.fn(),
    getProfileInfo: jest.fn(),
    getCredentials: jest.fn(),
    signOut: jest.fn(),
  };

  const scaffolderApiMock: jest.Mocked<Required<ScaffolderApi>> = {
    scaffold: jest.fn(),
    getTemplateParameterSchema: jest.fn(),
    listTasks: jest.fn(),
  } as any;

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

    scaffolderApiMock.listTasks.mockResolvedValue({ tasks: [] });

    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [identityApiRef, identityApi],
          [scaffolderApiRef, scaffolderApiMock],
        ]}
      >
        <ListTasksPage />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/root': rootRouteRef,
        },
      },
    );

    expect(getByText('List template tasks')).toBeInTheDocument();
    expect(getByText('All tasks that have been started')).toBeInTheDocument();
    expect(getByText('Tasks')).toBeInTheDocument();
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
    scaffolderApiMock.listTasks.mockResolvedValue({
      tasks: [
        {
          id: 'a-random-id',
          spec: {
            user: { ref: 'user:default/foo' },
            templateInfo: {
              entityRef: 'template:default/test',
            },
          } as any,
          status: 'completed',
          createdAt: '',
          lastHeartbeatAt: '',
        },
      ],
    });

    scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
      title: 'One Template',
      steps: [],
    });

    const { getByText, findByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [identityApiRef, identityApi],
          [scaffolderApiRef, scaffolderApiMock],
        ]}
      >
        <ListTasksPage />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/root': rootRouteRef,
        },
      },
    );

    expect(scaffolderApiMock.listTasks).toBeCalledWith({
      filterByOwnership: 'owned',
    });
    expect(getByText('List template tasks')).toBeInTheDocument();
    expect(getByText('All tasks that have been started')).toBeInTheDocument();
    expect(getByText('Tasks')).toBeInTheDocument();
    expect(await findByText('One Template')).toBeInTheDocument();
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

    scaffolderApiMock.listTasks
      .mockResolvedValue({
        tasks: [
          {
            id: 'a-random-id',
            spec: {
              user: { ref: 'user:default/foo' },
              templateInfo: {
                entityRef: 'template:default/mock',
              },
            } as any,
            status: 'completed',
            createdAt: '',
            lastHeartbeatAt: '',
          },
        ],
      })
      .mockResolvedValue({
        tasks: [
          {
            id: 'b-random-id',
            spec: {
              templateInfo: {
                entityRef: 'template:default/mock',
              },
              user: {
                ref: 'user:default/boo',
              },
            } as any,
            status: 'completed',
            createdAt: '',
            lastHeartbeatAt: '',
          },
        ],
      });

    scaffolderApiMock.getTemplateParameterSchema.mockResolvedValue({
      title: 'One Template',
      steps: [],
    });

    const { getByText, findByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [identityApiRef, identityApi],
          [scaffolderApiRef, scaffolderApiMock],
        ]}
      >
        <ListTasksPage />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
          '/root': rootRouteRef,
        },
      },
    );

    await act(async () => {
      const allButton = await getByText('All');
      fireEvent.click(allButton);
    });

    expect(scaffolderApiMock.listTasks).toBeCalledWith({
      filterByOwnership: 'all',
    });
    expect(await findByText('One Template')).toBeInTheDocument();
    expect(await findByText('OtherUser')).toBeInTheDocument();
  });
});

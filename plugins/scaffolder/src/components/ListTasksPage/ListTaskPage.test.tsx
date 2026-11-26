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

import { stringifyEntityRef } from '@backstage/catalog-model';
import {
  renderInTestApp,
  TestApiProvider,
  mockApis,
} from '@backstage/test-utils';
import {
  catalogApiRef,
  EntityPresentationApi,
  entityPresentationApiRef,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { identityApiRef } from '@backstage/core-plugin-api';
import { ListTasksPage } from './ListTasksPage';
import {
  ScaffolderApi,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import {
  act,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { rootRouteRef } from '../../routes';
import { permissionApiRef } from '@backstage/plugin-permission-react';

describe('<ListTasksPage />', () => {
  const catalogApi = catalogApiMock.mock();

  const identityApi = mockApis.identity();

  const scaffolderApiMock: jest.Mocked<Required<ScaffolderApi>> = {
    scaffold: jest.fn(),
    getTemplateParameterSchema: jest.fn(),
    listTasks: jest.fn(),
  } as any;

  const mockPermissionApi = { authorize: jest.fn() };

  it('should render the page', async () => {
    scaffolderApiMock.listTasks.mockResolvedValue({ tasks: [], totalTasks: 0 });

    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [identityApiRef, identityApi],
          [scaffolderApiRef, scaffolderApiMock],
          [permissionApiRef, mockPermissionApi],
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
      totalTasks: 1,
    });

    const { getByText, findByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [identityApiRef, identityApi],
          [scaffolderApiRef, scaffolderApiMock],
          [permissionApiRef, mockPermissionApi],
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

    expect(scaffolderApiMock.listTasks).toHaveBeenCalledWith({
      filterByOwnership: 'owned',
      limit: 5,
      offset: 0,
    });
    expect(getByText('List template tasks')).toBeInTheDocument();
    expect(getByText('All tasks that have been started')).toBeInTheDocument();
    expect(getByText('Tasks')).toBeInTheDocument();
    expect(await findByText('test')).toBeInTheDocument();
    expect(await findByText('foo')).toBeInTheDocument();
  });

  it('should render all tasks', async () => {
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
        totalTasks: 1,
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
        totalTasks: 1,
      });

    const { getByText, findByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [identityApiRef, identityApi],
          [scaffolderApiRef, scaffolderApiMock],
          [permissionApiRef, mockPermissionApi],
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
      const allButton = getByText('All');
      fireEvent.click(allButton);
    });

    expect(scaffolderApiMock.listTasks).toHaveBeenCalledWith({
      filterByOwnership: 'all',
      limit: 5,
      offset: 0,
    });
    expect(await findByText('mock')).toBeInTheDocument();
    expect(await findByText('boo')).toBeInTheDocument();
  });

  it('should use the entity presentation API for rendering, sorting, and filtering templates and owners', async () => {
    scaffolderApiMock.listTasks.mockResolvedValue({
      tasks: [
        {
          id: 'task-1',
          spec: {
            user: { ref: 'user:default/alice' },
            templateInfo: {
              entityRef: 'template:default/alpha-template',
            },
          } as any,
          status: 'completed',
          createdAt: '',
          lastHeartbeatAt: '',
        },
        {
          id: 'task-2',
          spec: {
            user: { ref: 'user:default/bob' },
            templateInfo: {
              entityRef: 'template:default/beta-template',
            },
          } as any,
          status: 'completed',
          createdAt: '',
          lastHeartbeatAt: '',
        },
      ],
      totalTasks: 2,
    });

    const presentations: Record<string, string> = {
      'template:default/alpha-template': 'Zebra Template',
      'template:default/beta-template': 'Aardvark Template',
      'user:default/alice': 'Alice Example',
      'user:default/bob': 'Bob Example',
    };

    const entityPresentationApi: EntityPresentationApi = {
      forEntity: entityOrRef => {
        const ref =
          typeof entityOrRef === 'string'
            ? entityOrRef
            : stringifyEntityRef(entityOrRef);
        const snapshot = {
          entityRef: ref,
          primaryTitle: presentations[ref] ?? ref,
        };
        return {
          snapshot,
          promise: Promise.resolve(snapshot),
        };
      },
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, catalogApi],
          [identityApiRef, identityApi],
          [scaffolderApiRef, scaffolderApiMock],
          [permissionApiRef, mockPermissionApi],
          [entityPresentationApiRef, entityPresentationApi],
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

    expect(await screen.findByText('Zebra Template')).toBeInTheDocument();
    expect(await screen.findByText('Aardvark Template')).toBeInTheDocument();
    expect(await screen.findByText('Alice Example')).toBeInTheDocument();
    expect(await screen.findByText('Bob Example')).toBeInTheDocument();

    // Sort by Template column using presented titles (Aardvark before Zebra)
    fireEvent.click(screen.getByText('Template'));
    const linksAfterSort = screen
      .getAllByRole('link')
      .map(link => link.textContent);
    expect(linksAfterSort.indexOf('Aardvark Template')).toBeLessThan(
      linksAfterSort.indexOf('Zebra Template'),
    );

    // Filter by presented template title (debounced in Table)
    const searchInput = screen.getByPlaceholderText('Filter');
    fireEvent.change(searchInput, { target: { value: 'Zebra' } });
    await waitForElementToBeRemoved(() =>
      screen.queryByText('Aardvark Template'),
    );
    expect(screen.getByText('Zebra Template')).toBeInTheDocument();

    // Filter by presented owner display name
    fireEvent.change(searchInput, { target: { value: 'Bob Example' } });
    expect(await screen.findByText('Aardvark Template')).toBeInTheDocument();
    expect(screen.queryByText('Zebra Template')).not.toBeInTheDocument();
  });
});

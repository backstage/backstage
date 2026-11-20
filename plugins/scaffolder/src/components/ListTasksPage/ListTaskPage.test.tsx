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

import {
  renderInTestApp,
  TestApiProvider,
  mockApis,
} from '@backstage/test-utils';
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
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
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    expect(await findByText('One Template')).toBeInTheDocument();
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
    expect(await findByText('One Template')).toBeInTheDocument();
    expect(await findByText('boo')).toBeInTheDocument();
  });

  it('should order tasks by the backend when sorting a column', async () => {
    scaffolderApiMock.listTasks.mockResolvedValue({ tasks: [], totalTasks: 0 });

    await renderInTestApp(
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

    await userEvent.click(
      within(
        await screen.findByRole('columnheader', { name: /Status/ }),
      ).getByText('Status'),
    );

    await waitFor(() =>
      expect(scaffolderApiMock.listTasks).toHaveBeenLastCalledWith(
        expect.objectContaining({ order: [{ field: 'status', order: 'asc' }] }),
      ),
    );
  });

  it('should filter tasks by owner, template, status and time range', async () => {
    scaffolderApiMock.listTasks.mockResolvedValue({ tasks: [], totalTasks: 0 });
    catalogApi.queryEntities.mockImplementation(async request => {
      const kind = (request as { filter: { kind: string } }).filter.kind;
      return {
        items: [
          {
            apiVersion: 'backstage.io/v1alpha1',
            kind,
            metadata: { name: `my-${kind}`, title: `My ${kind}` },
          },
        ],
        totalItems: 1,
        pageInfo: {},
      };
    });

    await renderInTestApp(
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

    await userEvent.click(await screen.findByText('All'));
    await userEvent.click(await screen.findByLabelText('Created by'));
    await userEvent.click(await screen.findByText('My user'));
    await userEvent.click(await screen.findByLabelText('Template'));
    await userEvent.click(await screen.findByText('My template'));
    await userEvent.click(screen.getByLabelText('Status'));
    await userEvent.click(await screen.findByText('failed'));
    const typeDate = async (label: string, date: string) => {
      const [month] = screen.getAllByRole('spinbutton', {
        name: new RegExp(`^month.*${label}`),
      });
      await userEvent.click(month);
      await userEvent.keyboard(date);
    };
    await typeDate('Created from', '01102026');
    await typeDate('Created until', '01202026');

    await waitFor(() =>
      expect(scaffolderApiMock.listTasks).toHaveBeenLastCalledWith({
        filterByOwnership: 'all',
        createdBy: ['user:default/my-user'],
        templateRef: ['template:default/my-template'],
        status: ['failed'],
        createdAfter: new Date('2026-01-10T00:00:00'),
        createdBefore: new Date('2026-01-20T23:59:59.999'),
        limit: 5,
        offset: 0,
      }),
    );

    await userEvent.click(screen.getByText('Clear filters'));

    await waitFor(() =>
      expect(scaffolderApiMock.listTasks).toHaveBeenLastCalledWith({
        filterByOwnership: 'all',
        limit: 5,
        offset: 0,
      }),
    );
  }, 30000);
});

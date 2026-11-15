/*
 * Copyright 2026 The Backstage Authors
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
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { configApiRef } from '@backstage/core-plugin-api';
import { toastApiRef } from '@backstage/frontend-plugin-api';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { devToolsApiRef, DevToolsApi } from '../../../api';
import {
  ScheduledTasks,
  TaskApiTasksResponse,
} from '@backstage/plugin-devtools-common/alpha';
import { ScheduledTasksContent } from './ScheduledTasksContent';

const mockTaskA: TaskApiTasksResponse = {
  taskId: 'task-a',
  pluginId: 'plugin-a',
  scope: 'global',
  settings: { version: 1 },
  taskState: {
    status: 'idle',
    startsAt: new Date(Date.now() + 60000).toISOString(),
  },
  workerState: { status: 'idle' },
};

const mockTaskB: TaskApiTasksResponse = {
  taskId: 'task-b',
  pluginId: 'plugin-b',
  scope: 'global',
  settings: { version: 1 },
  taskState: {
    status: 'idle',
  },
  workerState: { status: 'idle' },
};

describe('ScheduledTasksContent', () => {
  const mockDevToolsApi: jest.Mocked<DevToolsApi> = {
    getScheduledTasksByPlugin: jest.fn(),
    triggerScheduledTask: jest.fn(),
    cancelScheduledTask: jest.fn(),
    getConfig: jest.fn(),
    getExternalDependencies: jest.fn(),
    getInfo: jest.fn(),
  };

  const mockToastApi = {
    post: jest.fn(),
  };

  const configApi = mockApis.config({
    data: {
      devTools: {
        scheduledTasks: {
          plugins: ['plugin-a', 'plugin-b'],
        },
      },
    },
  });

  const renderComponent = async () => {
    return renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, configApi],
          [toastApiRef, mockToastApi],
          [devToolsApiRef, mockDevToolsApi],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <ScheduledTasksContent />
      </TestApiProvider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('a refresh keeps the table rendered', async () => {
    mockDevToolsApi.getScheduledTasksByPlugin.mockResolvedValue({
      scheduledTasks: [mockTaskA],
    });
    mockDevToolsApi.triggerScheduledTask.mockResolvedValue({});

    await renderComponent();

    expect(await screen.findByText('task-a')).toBeInTheDocument();

    let resolveRefresh: (value: ScheduledTasks) => void = () => {};
    const refreshPromise = new Promise<ScheduledTasks>(resolve => {
      resolveRefresh = resolve;
    });

    mockDevToolsApi.getScheduledTasksByPlugin.mockImplementation(
      () => refreshPromise,
    );

    const triggerButton = screen.getByRole('button', { name: 'Trigger' });
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(mockDevToolsApi.triggerScheduledTask).toHaveBeenCalledWith(
        'plugin-a',
        'task-a',
      );
    });

    // Table should stay rendered while refreshing
    expect(screen.getByText('task-a')).toBeInTheDocument();
    expect(screen.queryByTestId('progress')).not.toBeInTheDocument();

    resolveRefresh({
      scheduledTasks: [
        {
          ...mockTaskA,
          taskState: { status: 'running', startedAt: new Date().toISOString() },
        },
      ],
    });

    expect(await screen.findByText('Running')).toBeInTheDocument();
    expect(screen.getByText('task-a')).toBeInTheDocument();
  });

  it('switching plugins shows progress', async () => {
    mockDevToolsApi.getScheduledTasksByPlugin.mockResolvedValueOnce({
      scheduledTasks: [mockTaskA],
    });

    await renderComponent();

    expect(await screen.findByText('task-a')).toBeInTheDocument();

    let resolvePluginB: (value: ScheduledTasks) => void = () => {};
    const pluginBPromise = new Promise<ScheduledTasks>(resolve => {
      resolvePluginB = resolve;
    });

    mockDevToolsApi.getScheduledTasksByPlugin.mockImplementation(
      () => pluginBPromise,
    );

    const input = screen.getByRole('textbox', { name: /select plugin/i });
    fireEvent.change(input, { target: { value: 'plugin-b' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    // Progress spinner should replace the table while loading the new plugin
    expect(await screen.findByTestId('progress')).toBeInTheDocument();
    expect(screen.queryByText('task-a')).not.toBeInTheDocument();

    resolvePluginB({
      scheduledTasks: [mockTaskB],
    });

    expect(await screen.findByText('task-b')).toBeInTheDocument();
    expect(screen.queryByTestId('progress')).not.toBeInTheDocument();
  });

  it('a 403 shows the real error message', async () => {
    const error403 = Object.assign(
      new Error('Request failed with 403 Forbidden'),
      {
        name: 'ResponseError',
        statusCode: 403,
      },
    );
    mockDevToolsApi.getScheduledTasksByPlugin.mockRejectedValue(error403);

    await renderComponent();

    expect(
      await screen.findByText(/Error Loading Scheduled Tasks/),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Request failed with 403 Forbidden'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        /doesn't have any scheduled tasks or may contain a typo/i,
      ),
    ).not.toBeInTheDocument();
  });

  it('a 404 shows the real error message and keeps the typo hint', async () => {
    const error404 = Object.assign(
      new Error('Request failed with 404 Not Found'),
      {
        name: 'ResponseError',
        statusCode: 404,
      },
    );
    mockDevToolsApi.getScheduledTasksByPlugin.mockRejectedValue(error404);

    await renderComponent();

    expect(
      await screen.findByText(/No Scheduled Tasks Found/),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Request failed with 404 Not Found'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /doesn't have any scheduled tasks or may contain a typo/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The plugin ID is spelled correctly/i),
    ).toBeInTheDocument();
  });
});

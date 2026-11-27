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
import {
  act,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import { configApiRef } from '@backstage/core-plugin-api';
import { toastApiRef } from '@backstage/frontend-plugin-api';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { SWRConfig } from 'swr';
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

  const renderComponent = async (
    authorize:
      | typeof AuthorizeResult.ALLOW
      | typeof AuthorizeResult.DENY = AuthorizeResult.ALLOW,
  ) => {
    return renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, configApi],
          [toastApiRef, mockToastApi],
          [devToolsApiRef, mockDevToolsApi],
          [permissionApiRef, mockApis.permission({ authorize })],
        ]}
      >
        <SWRConfig value={{ provider: () => new Map() }}>
          <ScheduledTasksContent />
        </SWRConfig>
      </TestApiProvider>,
    );
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('a refresh keeps the table rendered', async () => {
    mockDevToolsApi.getScheduledTasksByPlugin.mockResolvedValue({
      scheduledTasks: [mockTaskA],
    });
    let finishTrigger: (result: {}) => void = () => {};
    mockDevToolsApi.triggerScheduledTask.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          finishTrigger = resolve;
        }),
    );

    await renderComponent();

    expect(await screen.findByText('task-a')).toBeInTheDocument();

    let resolveRefresh: (value: ScheduledTasks) => void = () => {};
    const refreshPromise = new Promise<ScheduledTasks>(resolve => {
      resolveRefresh = resolve;
    });

    mockDevToolsApi.getScheduledTasksByPlugin.mockImplementation(
      () => refreshPromise,
    );

    const triggerButton = screen.getByRole('button', {
      name: 'Run task task-a',
    });
    fireEvent.click(triggerButton);
    expect(
      await within(triggerButton).findByRole('progressbar', {
        name: 'Loading',
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Cancel task task-a' }),
    ).toBeDisabled();
    expect(mockDevToolsApi.getScheduledTasksByPlugin).toHaveBeenCalledTimes(1);
    await act(async () => finishTrigger({}));
    expect(
      within(triggerButton).queryByRole('progressbar'),
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockDevToolsApi.triggerScheduledTask).toHaveBeenCalledWith(
        'plugin-a',
        'task-a',
      );
    });

    // Table should stay rendered while refreshing
    expect(screen.getByText('task-a')).toBeInTheDocument();
    expect(screen.queryByTestId('core-progress')).not.toBeInTheDocument();

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

  it('switching plugins from the list shows progress', async () => {
    mockDevToolsApi.getScheduledTasksByPlugin.mockResolvedValueOnce({
      scheduledTasks: [mockTaskA],
    });

    await renderComponent();

    expect(await screen.findByText('task-a')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Run task task-a' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Cancel task task-a' }),
    ).toBeInTheDocument();

    let resolvePluginB: (value: ScheduledTasks) => void = () => {};
    const pluginBPromise = new Promise<ScheduledTasks>(resolve => {
      resolvePluginB = resolve;
    });

    mockDevToolsApi.getScheduledTasksByPlugin.mockImplementation(
      () => pluginBPromise,
    );

    const input = screen.getByRole('combobox', { name: /select plugin/i });
    expect(input).toHaveValue('plugin-a');
    fireEvent.click(screen.getByRole('button', { name: /show suggestions/i }));
    fireEvent.click(await screen.findByRole('option', { name: 'plugin-b' }));

    // Progress spinner should replace the table while loading the new plugin
    expect(await screen.findByTestId('core-progress')).toBeInTheDocument();
    expect(screen.queryByText('task-a')).not.toBeInTheDocument();
    expect(mockDevToolsApi.getScheduledTasksByPlugin).toHaveBeenLastCalledWith(
      'plugin-b',
    );
    expect(input).toHaveValue('plugin-b');

    resolvePluginB({
      scheduledTasks: [mockTaskB],
    });

    expect(await screen.findByText('task-b')).toBeInTheDocument();
    expect(screen.queryByTestId('core-progress')).not.toBeInTheDocument();

    // Enter after a mouse pick still commits typed text
    mockDevToolsApi.getScheduledTasksByPlugin.mockResolvedValue({
      scheduledTasks: [
        { ...mockTaskB, taskId: 'task-c', pluginId: 'plugin-c' },
      ],
    });
    fireEvent.change(input, { target: { value: 'plugin-c' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(await screen.findByText('task-c')).toBeInTheDocument();
    expect(mockDevToolsApi.getScheduledTasksByPlugin).toHaveBeenLastCalledWith(
      'plugin-c',
    );
  });

  it('commits keyboard selections and custom plugin IDs', async () => {
    mockDevToolsApi.getScheduledTasksByPlugin.mockResolvedValueOnce({
      scheduledTasks: [mockTaskA],
    });

    await renderComponent();

    expect(await screen.findByText('task-a')).toBeInTheDocument();

    const input = screen.getByRole('combobox', { name: /select plugin/i });

    // Keyboard pick wins over the partially typed text
    mockDevToolsApi.getScheduledTasksByPlugin.mockResolvedValue({
      scheduledTasks: [mockTaskB],
    });
    act(() => input.focus());
    fireEvent.change(input, { target: { value: '-b' } });
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(await screen.findByText('task-b')).toBeInTheDocument();
    expect(input).toHaveValue('plugin-b');
    expect(mockDevToolsApi.getScheduledTasksByPlugin).not.toHaveBeenCalledWith(
      '-b',
    );

    // Plugin IDs outside the configured list still work
    mockDevToolsApi.getScheduledTasksByPlugin.mockResolvedValue({
      scheduledTasks: [
        { ...mockTaskB, taskId: 'task-c', pluginId: 'plugin-c' },
      ],
    });
    fireEvent.change(input, { target: { value: 'plugin-c' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(await screen.findByText('task-c')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Scheduled tasks' }),
    ).toBeInTheDocument();
    expect(mockDevToolsApi.getScheduledTasksByPlugin).toHaveBeenLastCalledWith(
      'plugin-c',
    );
    expect(input).toHaveValue('plugin-c');

    // Blur commits typed text, and an empty value is reverted instead
    fireEvent.change(input, { target: { value: 'plugin-a' } });
    act(() => input.blur());

    await waitFor(() =>
      expect(
        mockDevToolsApi.getScheduledTasksByPlugin,
      ).toHaveBeenLastCalledWith('plugin-a'),
    );

    act(() => input.focus());
    fireEvent.change(input, { target: { value: '  ' } });
    act(() => input.blur());

    expect(input).toHaveValue('plugin-a');
    expect(mockDevToolsApi.getScheduledTasksByPlugin).not.toHaveBeenCalledWith(
      '',
    );
  });

  it('exposes the permission indicator without a nonfunctional button', async () => {
    mockDevToolsApi.getScheduledTasksByPlugin.mockResolvedValue({
      scheduledTasks: [mockTaskA],
    });
    await renderComponent(AuthorizeResult.DENY);

    const indicator = await screen.findByRole('img', {
      name: 'You are not allowed to perform this action',
    });
    expect(indicator).toHaveAttribute('tabindex', '0');
    expect(
      screen.queryByRole('button', { name: 'Run task task-a' }),
    ).not.toBeInTheDocument();
    act(() => screen.getByRole('row', { name: /task-a/ }).focus());
    act(() => indicator.focus());
    expect(indicator).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent(
      'You are not allowed to perform this action',
    );
  });

  it('updates a persistent status when an empty plugin result loads', async () => {
    let resolveTasks: (value: ScheduledTasks) => void = () => {};
    mockDevToolsApi.getScheduledTasksByPlugin.mockReturnValueOnce(
      new Promise(resolve => {
        resolveTasks = resolve;
      }),
    );
    await renderComponent();

    const status = screen.getByRole('status');
    expect(status).toBeEmptyDOMElement();
    resolveTasks({ scheduledTasks: [] });
    expect(
      await screen.findByText('No scheduled tasks found for plugin-a.', {
        selector: '[role="status"]',
      }),
    ).toBe(status);
    expect(screen.getByRole('status')).toBe(status);

    mockDevToolsApi.getScheduledTasksByPlugin.mockResolvedValueOnce({
      scheduledTasks: [mockTaskB],
    });
    fireEvent.click(screen.getByRole('button', { name: /show suggestions/i }));
    fireEvent.click(await screen.findByRole('option', { name: 'plugin-b' }));
    expect(await screen.findByText('task-b')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toBeEmptyDOMElement();

    mockDevToolsApi.getScheduledTasksByPlugin.mockResolvedValueOnce({
      scheduledTasks: [],
    });
    fireEvent.click(screen.getByRole('button', { name: /show suggestions/i }));
    fireEvent.click(await screen.findByRole('option', { name: 'plugin-a' }));
    expect(
      await screen.findByText('No scheduled tasks found for plugin-a.', {
        selector: '[role="status"]',
      }),
    ).toBe(status);

    mockDevToolsApi.getScheduledTasksByPlugin.mockRejectedValueOnce(
      new Error('Unable to load tasks'),
    );
    const input = screen.getByRole('combobox', { name: /select plugin/i });
    fireEvent.change(input, { target: { value: 'plugin-c' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(await screen.findByText('Unable to load tasks')).toBeInTheDocument();
    expect(status).toBeEmptyDOMElement();
  });

  it('distinguishes an empty search from an empty plugin response', async () => {
    mockDevToolsApi.getScheduledTasksByPlugin.mockResolvedValue({
      scheduledTasks: [mockTaskA],
    });
    await renderComponent();
    expect(await screen.findByText('task-a')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('searchbox', { name: /search/i }), {
      target: { value: 'no-matching-task' },
    });
    expect(await screen.findByText('No results found')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(
      screen.queryByText('No scheduled tasks found for plugin-a.'),
    ).not.toBeInTheDocument();
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
  it('opens task details and preserves cancel feedback and refresh', async () => {
    mockDevToolsApi.getScheduledTasksByPlugin.mockResolvedValue({
      scheduledTasks: [
        {
          ...mockTaskA,
          settings: { version: 1, cadence: 'PT1M' },
          taskState: {
            status: 'running',
            startedAt: '2026-01-01T12:00:00Z',
            timesOutAt: '2026-01-01T12:05:00Z',
            lastRunError: 'Previous run failed',
          },
        },
      ],
    });
    mockDevToolsApi.cancelScheduledTask.mockRejectedValue(
      new Error('Cancellation failed'),
    );
    await renderComponent();
    const details = await screen.findByRole('button', { name: 'task-a' });
    expect(within(details).getByText('task-a')).toHaveAttribute(
      'title',
      'task-a',
    );
    act(() => details.focus());
    fireEvent.click(details);
    const dialog = await screen.findByRole('dialog', { name: 'task-a' });
    expect(dialog).toBeVisible();
    expect(await screen.findByText('Previous run failed')).toBeVisible();
    expect(screen.getByText('PT1M')).toBeVisible();
    expect(screen.getByText('global')).toBeVisible();
    expect(
      screen.getByText(new Date('2026-01-01T12:00:00Z').toLocaleString()),
    ).toBeVisible();
    expect(
      screen.getByText(new Date('2026-01-01T12:05:00Z').toLocaleString()),
    ).toBeVisible();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));
    expect(
      await screen.findByRole('button', { name: 'Run task task-a' }),
    ).toBeVisible();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole('row', { name: /task-a/ })).toHaveFocus(),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Cancel task task-a' }));
    await waitFor(() =>
      expect(mockToastApi.post).toHaveBeenCalledWith({
        title: 'Error cancelling task task-a: Cancellation failed',
        status: 'danger',
      }),
    );
    expect(mockDevToolsApi.cancelScheduledTask).toHaveBeenCalledWith(
      'plugin-a',
      'task-a',
    );
    expect(mockDevToolsApi.getScheduledTasksByPlugin).toHaveBeenCalledTimes(2);
    expect(screen.getByText('task-a')).toBeVisible();
  });

  it('sorts, searches, and paginates task rows', async () => {
    mockDevToolsApi.getScheduledTasksByPlugin.mockResolvedValue({
      scheduledTasks: Array.from({ length: 7 }, (_, index) => ({
        ...mockTaskA,
        taskId: `task-${index}`,
      })),
    });
    await renderComponent();
    expect(await screen.findByText('task-0')).toBeVisible();
    expect(screen.queryByText('task-5')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(await screen.findByText('task-5')).toBeVisible();
    expect(screen.queryByText('task-0')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('columnheader', { name: 'Task ID' }));
    expect(await screen.findByText('task-0')).toBeVisible();
    fireEvent.click(screen.getByRole('columnheader', { name: 'Task ID' }));
    expect(await screen.findByText('task-6')).toBeVisible();
    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('task-6')).toBeVisible();
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'task-2' },
    });
    expect(await screen.findByText('task-2')).toBeVisible();
    expect(screen.queryByText('task-6')).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'missing' },
    });
    expect(await screen.findByText('No results found')).toBeVisible();
  });
});

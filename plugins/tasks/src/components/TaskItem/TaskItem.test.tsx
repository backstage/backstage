/*
 * Copyright 2025 The Backstage Authors
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
import { fireEvent, waitFor } from '@testing-library/react';

import { TaskItem } from './TaskItem';
import { type Task, type WorkerStatus } from '@backstage/plugin-tasks-common';
import { ApiProvider } from '@backstage/core-app-api';
import { alertApiRef } from '@backstage/core-plugin-api';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';

// Mock the permission hook
jest.mock('@backstage/plugin-permission-react', () => ({
  usePermission: jest.fn(),
}));

// Mock the utils functions
jest.mock('../../utils', () => ({
  humanizeDuration: jest.fn((duration: string) => `humanized-${duration}`),
  humanizeCadence: jest.fn((cadence: string) => `humanized-${cadence}`),
  formatLastRun: jest.fn((date: string) => `formatted-${date}`),
  formatAbsoluteDateTime: jest.fn((date: string) => `absolute-${date}`),
  getNextRunTooltip: jest.fn(() => 'Next run tooltip'),
  getLastRunPill: jest.fn(() => ({
    label: 'Last Run',
    color: '#000',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    icon: <span>📅</span>,
  })),
  getNextRunPill: jest.fn(() => ({
    label: 'Next Run',
    color: '#000',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    icon: <span>⏰</span>,
  })),
  getWorkerStatusInfo: jest.fn(() => ({
    label: 'Worker idle',
    icon: '😴',
    colorVariant: 'default',
    tooltip:
      'Worker is not currently running this task. The task is waiting for its next scheduled execution time.',
  })),
  getScopeTooltip: jest.fn(() => 'Global'),
  getCadenceTooltip: jest.fn(() => 'Cadence tooltip'),
  getTimeoutTooltip: jest.fn(() => 'Timeout tooltip'),
  getInitialDelayTooltip: jest.fn(() => 'Initial delay tooltip'),
}));

const mockUsePermission =
  require('@backstage/plugin-permission-react').usePermission;

const mockTask: Task = {
  id: 'test-plugin:test-task',
  pluginId: 'test-plugin',
  taskId: 'test-task',
  meta: {
    title: 'Test Task',
    description: 'A test task description',
    pluginTitle: 'Test Plugin',
    pluginDescription: 'A test plugin',
  },
  task: {
    pluginId: 'test-plugin',
    taskId: 'test-task',
    scope: 'global',
    settings: {
      version: 1,
      initialDelayDuration: 'PT30S',
      timeoutAfterDuration: 'PT5M',
    },
    taskState: {
      status: 'idle',
      lastRunEndedAt: '2023-01-01T12:00:00Z',
      startsAt: '2023-01-01T13:00:00Z',
    },
    workerState: {
      status: 'idle',
    },
  },
  computed: {
    status: 'idle',
    cadence: 'PT1H',
    lastRunEndedAt: '2023-01-01T12:00:00Z',
    nextRunAt: '2023-01-01T13:00:00Z',
    workerStatus: 'idle' as WorkerStatus,
  },
};

const mockTriggerResult = {
  success: true,
};

const mockAlertApi = { post: jest.fn() };
const apis = TestApiRegistry.from([alertApiRef, mockAlertApi]);

const renderWithProviders = (component: React.ReactElement) => {
  return renderInTestApp(<ApiProvider apis={apis}>{component}</ApiProvider>);
};

describe('TaskItem', () => {
  const defaultProps = {
    task: mockTask,
    onTrigger: jest.fn().mockResolvedValue(mockTriggerResult),
    isTriggering: false,
    expanded: false,
    onExpandedChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePermission.mockReturnValue({
      loading: false,
      allowed: true,
    });
  });

  it('renders task title and description', async () => {
    const { getByText } = await renderWithProviders(
      <TaskItem {...defaultProps} />,
    );

    expect(getByText('Test Task')).toBeInTheDocument();
    expect(getByText('A test task description')).toBeInTheDocument();
  });

  it('renders task ID when title is not available', async () => {
    const taskWithoutTitle = {
      ...mockTask,
      meta: { ...mockTask.meta, title: undefined },
    };

    const { getByText } = await renderWithProviders(
      <TaskItem {...defaultProps} task={taskWithoutTitle} />,
    );

    expect(getByText('test-task')).toBeInTheDocument();
  });

  it('renders trigger button when user has permission', async () => {
    const { getByText } = await renderWithProviders(
      <TaskItem {...defaultProps} />,
    );

    expect(getByText('Trigger')).toBeInTheDocument();
  });

  it('does not render trigger button when user lacks permission', async () => {
    mockUsePermission.mockReturnValue({
      loading: false,
      allowed: false,
    });

    const { queryByText } = await renderWithProviders(
      <TaskItem {...defaultProps} />,
    );

    expect(queryByText('Trigger')).not.toBeInTheDocument();
  });

  it('shows loading state for trigger button when permission is loading', async () => {
    mockUsePermission.mockReturnValue({
      loading: true,
      allowed: false,
    });

    const { queryByText } = await renderWithProviders(
      <TaskItem {...defaultProps} />,
    );

    expect(queryByText('Trigger')).not.toBeInTheDocument();
  });

  it('handles trigger button click', async () => {
    const { getByText } = await renderWithProviders(
      <TaskItem {...defaultProps} />,
    );

    const triggerButton = getByText('Trigger');
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(defaultProps.onTrigger).toHaveBeenCalledWith(
        'test-plugin:test-task',
      );
    });
  });

  it('shows "Running..." when task is being triggered', async () => {
    const { getByText } = await renderWithProviders(
      <TaskItem {...defaultProps} isTriggering />,
    );

    expect(getByText('Running...')).toBeInTheDocument();
  });

  it('shows "Running" when task is active', async () => {
    const runningTask = {
      ...mockTask,
      computed: { ...mockTask.computed, status: 'running' },
    };

    const { getByText } = await renderWithProviders(
      <TaskItem {...defaultProps} task={runningTask} />,
    );

    expect(getByText('Running')).toBeInTheDocument();
  });

  it('shows "Waiting" when task is in initial wait', async () => {
    const waitingTask = {
      ...mockTask,
      computed: {
        ...mockTask.computed,
        workerStatus: 'initial-wait' as WorkerStatus,
      },
    };

    const { getByText } = await renderWithProviders(
      <TaskItem {...defaultProps} task={waitingTask} />,
    );

    expect(getByText('Waiting')).toBeInTheDocument();
  });

  it('disables trigger button during initial wait', async () => {
    const waitingTask = {
      ...mockTask,
      computed: {
        ...mockTask.computed,
        workerStatus: 'initial-wait' as WorkerStatus,
      },
    };

    const { getByRole } = await renderWithProviders(
      <TaskItem {...defaultProps} task={waitingTask} />,
    );

    const triggerButton = getByRole('button', { name: /waiting/i });
    expect(triggerButton).toBeDisabled();
  });

  it('handles expand/collapse functionality', async () => {
    const { getByLabelText } = await renderWithProviders(
      <TaskItem {...defaultProps} />,
    );

    const expandButton = getByLabelText('expand');
    fireEvent.click(expandButton);

    expect(defaultProps.onExpandedChange).toHaveBeenCalledWith(
      'test-plugin:test-task',
      true,
    );
  });

  it('shows correct expand icon based on expanded state', async () => {
    const { rerender, getByLabelText } = await renderWithProviders(
      <TaskItem {...defaultProps} />,
    );

    // Initially collapsed
    expect(getByLabelText('expand')).toBeInTheDocument();

    // Rerender as expanded
    rerender(<TaskItem {...defaultProps} expanded />);
    expect(getByLabelText('collapse')).toBeInTheDocument();
  });

  it('handles share functionality', async () => {
    const mockClipboard = {
      writeText: jest.fn().mockResolvedValue(undefined),
    };
    Object.assign(window.navigator, {
      clipboard: mockClipboard,
    });

    const { getByLabelText } = await renderWithProviders(
      <TaskItem {...defaultProps} />,
    );

    const shareButton = getByLabelText('share');
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalled();
    });
  });

  it('handles clipboard write failure gracefully', async () => {
    const mockClipboard = {
      writeText: jest.fn().mockRejectedValue(new Error('Clipboard error')),
    };
    Object.assign(window.navigator, {
      clipboard: mockClipboard,
    });

    const { getByLabelText } = await renderWithProviders(
      <TaskItem {...defaultProps} />,
    );

    const shareButton = getByLabelText('share');
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalled();
    });
  });

  it('applies highlighted styling when task is highlighted', async () => {
    const { getByRole } = await renderWithProviders(
      <TaskItem {...defaultProps} highlightedTaskId="test-plugin:test-task" />,
    );

    const taskItem = getByRole('listitem');
    expect(taskItem).toHaveClass('highlighted');
  });

  it('does not apply highlighted styling when task is not highlighted', async () => {
    const { getByRole } = await renderWithProviders(
      <TaskItem {...defaultProps} />,
    );

    const taskItem = getByRole('listitem');
    expect(taskItem).not.toHaveClass('highlighted');
  });

  it('renders task details when expanded', async () => {
    const { getByText } = await renderWithProviders(
      <TaskItem {...defaultProps} expanded />,
    );

    // TaskDetails component should be rendered when expanded
    expect(getByText('Execution')).toBeInTheDocument();
  });

  it('renders pills with correct styling', async () => {
    const { getByText } = await renderWithProviders(
      <TaskItem {...defaultProps} />,
    );

    // Check that both pills are rendered
    expect(getByText('Last Run')).toBeInTheDocument();
    expect(getByText('Next Run')).toBeInTheDocument();
  });

  it('handles task with error status', async () => {
    const errorTask = {
      ...mockTask,
      computed: {
        ...mockTask.computed,
        status: 'error',
        lastRunError: 'Task failed',
      },
    };

    const { getByText } = await renderWithProviders(
      <TaskItem {...defaultProps} task={errorTask} />,
    );

    expect(getByText('Test Task')).toBeInTheDocument();
  });

  it('handles task with no description', async () => {
    const taskWithoutDescription = {
      ...mockTask,
      meta: { ...mockTask.meta, description: undefined },
    };

    const { getByText, queryByText } = await renderWithProviders(
      <TaskItem {...defaultProps} task={taskWithoutDescription} />,
    );

    expect(getByText('Test Task')).toBeInTheDocument();
    expect(queryByText('A test task description')).not.toBeInTheDocument();
  });
});

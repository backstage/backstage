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
import { TaskDetails } from './TaskDetails';
import { type Task } from '@backstage/plugin-tasks-common';
import { renderInTestApp } from '@backstage/test-utils';

const mockTask: Task = {
  id: 'test-task-1',
  pluginId: 'test-plugin',
  taskId: 'test-task-1',
  meta: {
    title: 'Test Task',
    description: 'A test task for testing',
  },
  task: {
    taskId: 'test-task-1',
    pluginId: 'test-plugin',
    scope: 'global',
    settings: {
      version: 1,
      initialDelayDuration: 'PT30S',
      timeoutAfterDuration: 'PT5M',
    },
    taskState: null,
    workerState: null,
  },
  computed: {
    status: 'idle',
    cadence: 'PT1H',
    workerStatus: 'idle',
    lastRunEndedAt: undefined,
    lastRunError: undefined,
    nextRunAt: undefined,
    timesOutAt: undefined,
  },
};

describe('TaskDetails', () => {
  it('renders execution details correctly', async () => {
    const { getByText } = await renderInTestApp(
      <TaskDetails task={mockTask} />,
    );

    expect(getByText('Execution')).toBeInTheDocument();
    expect(getByText('global')).toBeInTheDocument();
    expect(getByText('1 hr')).toBeInTheDocument();
    expect(getByText('Initial delay: 30 sec')).toBeInTheDocument();
    expect(getByText('Timeout: 5 min')).toBeInTheDocument();
  });

  it('renders technical details correctly', async () => {
    const { getByText } = await renderInTestApp(
      <TaskDetails task={mockTask} />,
    );

    expect(getByText('Technical & Status')).toBeInTheDocument();
    expect(getByText('ID: test-task-1')).toBeInTheDocument();
    expect(getByText('v1')).toBeInTheDocument();
    expect(getByText('Worker idle')).toBeInTheDocument();
  });

  it('handles missing optional fields gracefully', async () => {
    const minimalTask: Task = {
      id: 'minimal-task',
      pluginId: 'test-plugin',
      taskId: 'minimal-task',
      meta: {
        title: 'Minimal Task',
      },
      task: {
        taskId: 'minimal-task',
        pluginId: 'test-plugin',
        scope: 'local',
        settings: {
          version: 1,
        },
        taskState: null,
        workerState: null,
      },
      computed: {
        status: 'idle',
        cadence: 'manual',
        workerStatus: 'idle',
        lastRunEndedAt: undefined,
        lastRunError: undefined,
        nextRunAt: undefined,
        timesOutAt: undefined,
      },
    };

    const { getByText } = await renderInTestApp(
      <TaskDetails task={minimalTask} />,
    );

    expect(getByText('Execution')).toBeInTheDocument();
    expect(getByText('local')).toBeInTheDocument();
    expect(getByText('manual')).toBeInTheDocument();
    expect(getByText('Technical & Status')).toBeInTheDocument();
    expect(getByText('ID: minimal-task')).toBeInTheDocument();
  });
});

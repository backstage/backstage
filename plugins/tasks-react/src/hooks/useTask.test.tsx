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
import { ReactNode } from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import { useTask } from './useTask';
import { tasksApiRef } from '../apis';
import { type Task } from '@backstage/plugin-tasks-common';

const mockTask: Task = {
  id: 'test-task',
  pluginId: 'test-plugin',
  taskId: 'test-task',
  meta: {
    title: 'Test Task',
    description: 'A test task',
  },
  task: {
    taskId: 'test-task',
    pluginId: 'test-plugin',
    scope: 'global',
    settings: { version: 1 },
    taskState: { status: 'idle' },
    workerState: { status: 'idle' },
  },
  computed: {
    status: 'idle',
    cadence: '* * * * *',
  },
};

const mockTasksApi = {
  getTasks: jest.fn().mockResolvedValue([mockTask]),
  getTask: jest.fn().mockResolvedValue(mockTask),
  triggerTask: jest.fn().mockResolvedValue(undefined),
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <TestApiProvider apis={[[tasksApiRef, mockTasksApi]]}>
    {children}
  </TestApiProvider>
);

describe('useTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch a single task by ID', async () => {
    const { result } = renderHook(() => useTask({ taskId: 'test-task' }), {
      wrapper,
    });

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.task).toBeUndefined();

    // Wait for the task to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.task).toEqual(mockTask);
    expect(result.current.error).toBeUndefined();
    expect(mockTasksApi.getTask).toHaveBeenCalledWith('test-task');
  });

  it('should handle task not found', async () => {
    mockTasksApi.getTask.mockResolvedValueOnce(undefined);

    const { result } = renderHook(
      () => useTask({ taskId: 'non-existent-task' }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.task).toBeUndefined();
    expect(result.current.error).toBeUndefined();
  });

  it('should trigger a task successfully', async () => {
    const { result } = renderHook(() => useTask({ taskId: 'test-task' }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Trigger the task
    let triggerResult: any;
    await act(async () => {
      triggerResult = await result.current.triggerTask();
    });

    expect(triggerResult.success).toBe(true);
    expect(triggerResult.error).toBeUndefined();
    expect(mockTasksApi.triggerTask).toHaveBeenCalledWith('test-task');
  });

  it('should handle trigger task error', async () => {
    const errorMessage = 'Failed to trigger task';
    mockTasksApi.triggerTask.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useTask({ taskId: 'test-task' }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Trigger the task
    let triggerResult: any;
    await act(async () => {
      triggerResult = await result.current.triggerTask();
    });

    expect(triggerResult.success).toBe(false);
    expect(triggerResult.error).toBe(errorMessage);
  });

  it('should return error when triggering without taskId', async () => {
    const { result } = renderHook(() => useTask({ taskId: '' }), { wrapper });

    let triggerResult: any;
    await act(async () => {
      triggerResult = await result.current.triggerTask();
    });

    expect(triggerResult.success).toBe(false);
    expect(triggerResult.error).toBe('No task ID provided');
  });
});

/*
 * Copyright 2024 The Backstage Authors
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

import { renderHook, act } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import { scaffolderApiRef } from '../api';
import { useTaskEventStream } from './useEventStream';
import { ScaffolderTask, ScaffolderTaskStatus } from '../api';
import { Subject } from 'rxjs';

describe('useTaskEventStream with duplicate step IDs', () => {
  const mockScaffolderApi = {
    getTask: jest.fn(),
    streamLogs: jest.fn(),
  };

  const mockTask: ScaffolderTask = {
    taskId: 'test-task',
    spec: {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      parameters: { option: true },
      steps: [
        {
          id: 'debug-repro',
          name: 'Option 1',
          action: 'debug:log',
          input: { message: 'Option is true' },
          if: 'parameters.option',
        },
        {
          id: 'debug-repro',
          name: 'Option 2',
          action: 'debug:log',
          input: { message: 'Option is false' },
          if: 'not parameters.option',
        },
      ],
      output: {},
    },
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <TestApiProvider apis={[[scaffolderApiRef, mockScaffolderApi]]}>
      {children}
    </TestApiProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle duplicate step IDs correctly', async () => {
    const logStream = new Subject();
    mockScaffolderApi.getTask.mockResolvedValue(mockTask);
    mockScaffolderApi.streamLogs.mockReturnValue(logStream);

    const { result } = renderHook(() => useTaskEventStream('test-task'), {
      wrapper,
    });

    // Wait for initial setup
    await act(async () => {
      await Promise.resolve();
    });

    // Emit individual log events that will be collected
    act(() => {
      logStream.next({
        type: 'log',
        createdAt: '2024-01-01T00:00:01Z',
        body: {
          stepId: 'debug-repro',
          status: 'processing' as ScaffolderTaskStatus,
          message: 'Beginning step Option 1',
        },
      });
    });

    act(() => {
      logStream.next({
        type: 'log',
        createdAt: '2024-01-01T00:00:02Z',
        body: {
          stepId: 'debug-repro',
          status: 'completed' as ScaffolderTaskStatus,
          message: 'Option is true',
        },
      });
    });

    act(() => {
      logStream.next({
        type: 'log',
        createdAt: '2024-01-01T00:00:03Z',
        body: {
          stepId: 'debug-repro',
          status: 'skipped' as ScaffolderTaskStatus,
          message:
            'Skipping step debug-repro because its if condition was false',
        },
      });
    });

    // Wait for the 500ms interval to process logs
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
    });

    // After the fix: we should have separate step entries with unique keys
    const stepKeys = Object.keys(result.current.steps);
    expect(stepKeys).toContain('0-debug-repro');
    expect(stepKeys).toContain('1-debug-repro');

    // Check the first step (should be completed)
    const firstStep = result.current.steps['0-debug-repro'];
    expect(firstStep.status).toBe('completed');
    expect(firstStep.id).toBe('debug-repro');

    // Check the second step (should be skipped)
    const secondStep = result.current.steps['1-debug-repro'];
    expect(secondStep.status).toBe('skipped');
    expect(secondStep.id).toBe('debug-repro');

    // Logs should be separated
    const firstStepLogs = result.current.stepLogs['0-debug-repro'];
    expect(firstStepLogs).toEqual([
      '2024-01-01T00:00:01Z Beginning step Option 1',
      '2024-01-01T00:00:02Z Option is true',
    ]);

    const secondStepLogs = result.current.stepLogs['1-debug-repro'];
    expect(secondStepLogs).toEqual([
      '2024-01-01T00:00:03Z Skipping step debug-repro because its if condition was false',
    ]);
  });
});

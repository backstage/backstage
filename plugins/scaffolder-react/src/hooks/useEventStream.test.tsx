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

import React, { FC, PropsWithChildren, useEffect } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTaskEventStream } from './useEventStream';
import { TestApiProvider } from '@backstage/test-utils';
import { scaffolderApiRef } from '../api';
import { Observable } from '@backstage/types';
import { LogEvent, ScaffolderTask, ScaffolderApi } from '../api';

// Creating a simple mock implementation of a Subject without using rxjs
interface MockSubject<T> {
  observers: Array<{ next: (value: T) => void }>;
  next: (value: T) => void;
  subscribe: (observer: { next: (value: T) => void }) => {
    unsubscribe: () => void;
  };
}

function createMockSubject<T>(): MockSubject<T> {
  const observers: Array<{ next: (value: T) => void }> = [];

  return {
    observers,
    next(value: T) {
      this.observers.forEach(observer => observer.next(value));
    },
    subscribe(observer: { next: (value: T) => void }) {
      this.observers.push(observer);
      return {
        unsubscribe: () => {
          const index = this.observers.indexOf(observer);
          if (index !== -1) {
            this.observers.splice(index, 1);
          }
        },
      };
    },
  };
}

describe('useTaskEventStream', () => {
  const mockTask: ScaffolderTask = {
    id: 'test-task-id',
    spec: {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      steps: [
        { id: 'step1', name: 'Step 1', action: 'action1' },
        { id: 'step2', name: 'Step 2', action: 'action2' },
      ],
      output: {},
      parameters: {},
      templateInfo: {
        entityRef: 'template:default/test-template',
      },
      user: {
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'User',
          metadata: {
            name: 'test-user',
            namespace: 'default',
          },
          spec: {
            memberOf: ['guests'],
          },
        },
      },
    },
    status: 'processing',
    lastHeartbeatAt: '2021-01-01T00:00:00Z',
    createdAt: '2021-01-01T00:00:00Z',
  };

  // Unique log events to ensure we can test for duplications
  const logEvents: LogEvent[] = [
    {
      id: 'log-event-1',
      type: 'log',
      body: {
        message: 'Log message 1',
        stepId: 'step1',
        status: 'processing',
      },
      createdAt: '2021-01-01T00:00:01Z',
      taskId: 'test-task-id',
    },
    {
      id: 'log-event-2',
      type: 'log',
      body: {
        message: 'Log message 2',
        stepId: 'step1',
      },
      createdAt: '2021-01-01T00:00:02Z',
      taskId: 'test-task-id',
    },
    {
      id: 'log-event-3',
      type: 'log',
      body: {
        message: 'Log message 3',
        stepId: 'step1',
      },
      createdAt: '2021-01-01T00:00:03Z',
      taskId: 'test-task-id',
    },
  ];

  let subject: MockSubject<LogEvent>;
  const mockScaffolderApi: Partial<ScaffolderApi> = {
    getTask: jest.fn(),
    streamLogs: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    subject = createMockSubject<LogEvent>();
    (mockScaffolderApi.getTask as jest.Mock).mockResolvedValue(mockTask);
    (mockScaffolderApi.streamLogs as jest.Mock).mockImplementation(() => {
      return subject as unknown as Observable<LogEvent>;
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  const Wrapper: FC<PropsWithChildren<{}>> = ({ children }) => (
    <TestApiProvider apis={[[scaffolderApiRef, mockScaffolderApi]]}>
      {children}
    </TestApiProvider>
  );

  it('should initialize with a task', async () => {
    const { result } = renderHook(() => useTaskEventStream('test-task-id'), {
      wrapper: Wrapper,
    });

    // Initially loading
    expect(result.current.loading).toBe(true);

    // Wait for task initialization
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockScaffolderApi.getTask).toHaveBeenCalledWith('test-task-id');
    expect(result.current.task).toEqual(mockTask);
  });

  it('should process log events correctly', async () => {
    const { result } = renderHook(() => useTaskEventStream('test-task-id'), {
      wrapper: Wrapper,
    });

    // Wait for task initialization
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Emit log events
    act(() => {
      subject.next(logEvents[0]);
      subject.next(logEvents[1]);
    });

    // Fast-forward timer to trigger log processing
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Verify logs are processed
    await waitFor(() => {
      expect(result.current.stepLogs.step1.length).toBe(2);
    });

    // Verify step status is updated
    expect(result.current.steps.step1.status).toBe('processing');
  });

  it('should not duplicate logs when component is remounted (tab switching scenario)', async () => {
    // Component that uses taskEventStream and tracks remounting
    const TaskComponent: FC<{ taskId: string; onMount: () => void }> = ({
      taskId,
      onMount,
    }) => {
      const taskStream = useTaskEventStream(taskId);

      useEffect(() => {
        onMount();
      }, [onMount]);

      return <div>{JSON.stringify(taskStream.stepLogs)}</div>;
    };

    const onMount = jest.fn();

    // First render
    const { result, unmount } = renderHook(
      () => useTaskEventStream('test-task-id'),
      {
        wrapper: Wrapper,
      },
    );

    // Wait for task initialization
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Emit first log event
    act(() => {
      subject.next(logEvents[0]);
      jest.advanceTimersByTime(500);
    });

    // Verify log is processed
    await waitFor(() => {
      expect(result.current.stepLogs.step1.length).toBe(1);
    });

    // Now simulate tab switching by unmounting
    unmount();

    // Make the mock of getTask return a task with the logs already present
    // This simulates the backend's behavior of returning all logs when reconnecting
    const updatedMockTask = {
      ...mockTask,
      // Add additional metadata to indicate logs are available
      logStream: {
        currentEvents: [logEvents[0]],
      },
    };

    (mockScaffolderApi.getTask as jest.Mock).mockResolvedValue(updatedMockTask);

    // Remount the component with a fresh hook
    const { result: newResult } = renderHook(
      () => useTaskEventStream('test-task-id'),
      {
        wrapper: Wrapper,
      },
    );

    // Wait for task to be re-initialized
    await waitFor(() => {
      expect(newResult.current.loading).toBe(false);
    });

    // Emit both events to make sure the new component has them
    act(() => {
      subject.next(logEvents[0]); // Re-emit the first event
      subject.next(logEvents[1]); // Emit the new event
      jest.advanceTimersByTime(500);
    });

    // Verify we now have 2 logs
    await waitFor(() => {
      expect(newResult.current.stepLogs.step1.length).toBe(2);
    });

    // Check that the same log event isn't processed twice
    act(() => {
      // Re-emit the same event again - this should be ignored
      subject.next(logEvents[0]);
      jest.advanceTimersByTime(500);
    });

    // Verify we still have only 2 logs (no duplication)
    await waitFor(() => {
      expect(newResult.current.stepLogs.step1.length).toBe(2);
    });

    // Verify streamLogs is called for each instance of the component
    // The current implementation creates a new subscription on each mount
    expect(mockScaffolderApi.streamLogs).toHaveBeenCalledTimes(2);
  });

  it('should handle completion event', async () => {
    const { result } = renderHook(() => useTaskEventStream('test-task-id'), {
      wrapper: Wrapper,
    });

    // Wait for task initialization
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Create a properly typed completion event
    const completionEvent = {
      id: 'completion-event',
      type: 'completion',
      body: {
        message: 'Task completed',
        // Define output using a type that matches what the reducer expects
        output: { links: [{ title: 'Result', url: 'https://example.com' }] },
      } as {
        message: string;
        output: { links: Array<{ title: string; url: string }> };
      },
      createdAt: '2021-01-01T00:01:00Z',
      taskId: 'test-task-id',
    } as LogEvent;

    // Emit completion event
    act(() => {
      subject.next(completionEvent);
    });

    // Verify completion is processed
    await waitFor(() => {
      expect(result.current.completed).toBe(true);
    });

    // Access output from result, not from the event directly
    expect(result.current.output).toEqual({
      links: [{ title: 'Result', url: 'https://example.com' }],
    });
  });
});

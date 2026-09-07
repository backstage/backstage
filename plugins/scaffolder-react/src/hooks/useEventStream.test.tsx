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

import { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { TestApiProvider } from '@backstage/test-utils';
import ObservableImpl from 'zen-observable';
import { LogEvent, ScaffolderTask } from '@backstage/plugin-scaffolder-common';
import { scaffolderApiRef } from '../api';
import { useTaskEventStream } from './useEventStream';

function makeTask(overrides: Partial<ScaffolderTask> = {}): ScaffolderTask {
  return {
    id: 'test-task-id',
    status: 'processing',
    createdAt: '2026-01-01T00:00:00Z',
    spec: {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      parameters: {},
      steps: [{ id: 'step-1', name: 'Step 1', action: 'debug:log' }],
      output: {},
      ...overrides.spec,
    } as ScaffolderTask['spec'],
    ...overrides,
  };
}

function makeLogEvent(id: number, message: string): LogEvent {
  return {
    id,
    taskId: 'test-task-id',
    type: 'log',
    createdAt: '2026-01-01T00:00:00Z',
    body: { message, stepId: 'step-1', status: 'processing' },
  };
}

describe('useTaskEventStream', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function setup(mockApi: { getTask: jest.Mock; streamLogs: jest.Mock }) {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TestApiProvider apis={[[scaffolderApiRef, mockApi]]}>
        {children}
      </TestApiProvider>
    );
    return renderHook(() => useTaskEventStream('test-task-id'), { wrapper });
  }

  it('flushes buffered logs before tearing down on visibility hide', async () => {
    let streamSubscriber: ZenObservable.SubscriptionObserver<LogEvent>;

    const mockApi = {
      getTask: jest.fn().mockResolvedValue(makeTask()),
      streamLogs: jest.fn().mockImplementation(
        () =>
          new ObservableImpl<LogEvent>(subscriber => {
            streamSubscriber = subscriber;
          }),
      ),
    };

    const { result } = setup(mockApi);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockApi.streamLogs).toHaveBeenCalledTimes(1);

    act(() => {
      streamSubscriber.next(makeLogEvent(1, 'buffered log'));
    });

    Object.defineProperty(document, 'hidden', {
      value: true,
      writable: true,
      configurable: true,
    });
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(result.current.stepLogs['step-1']).toContainEqual(
      expect.stringContaining('buffered log'),
    );

    Object.defineProperty(document, 'hidden', {
      value: false,
      writable: true,
      configurable: true,
    });
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(mockApi.streamLogs).toHaveBeenCalledTimes(2);
    expect(mockApi.streamLogs).toHaveBeenLastCalledWith(
      expect.objectContaining({ after: 1 }),
    );
  });

  it('clears error state when reconnecting after transport error', async () => {
    let streamSubscriber: ZenObservable.SubscriptionObserver<LogEvent>;
    const mockApi = {
      getTask: jest.fn().mockResolvedValue(makeTask()),
      streamLogs: jest.fn().mockImplementation(
        () =>
          new ObservableImpl<LogEvent>(subscriber => {
            streamSubscriber = subscriber;
          }),
      ),
    };

    const { result } = setup(mockApi);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    act(() => {
      streamSubscriber.error(new Error('connection refused'));
    });

    expect(result.current.error?.message).toBe('connection refused');
    expect(result.current.completed).toBe(true);

    await act(async () => {
      jest.advanceTimersByTime(15000);
    });

    expect(result.current.error).toBeUndefined();
    expect(result.current.completed).toBe(false);
    expect(mockApi.streamLogs).toHaveBeenCalledTimes(2);
  });

  it('cleans up stream on unmount even for recoverable tasks', async () => {
    const unsubscribeSpy = jest.fn();
    const mockApi = {
      getTask: jest.fn().mockResolvedValue(
        makeTask({
          spec: {
            apiVersion: 'scaffolder.backstage.io/v1beta3',
            parameters: {},
            steps: [{ id: 'step-1', name: 'Step 1', action: 'debug:log' }],
            output: {},
            EXPERIMENTAL_recovery: {
              EXPERIMENTAL_strategy: 'startOver',
            },
          } as ScaffolderTask['spec'],
        }),
      ),
      streamLogs: jest.fn().mockImplementation(
        () =>
          new ObservableImpl<LogEvent>(() => {
            return () => unsubscribeSpy();
          }),
      ),
    };

    const { unmount } = setup(mockApi);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockApi.streamLogs).toHaveBeenCalledTimes(1);

    unmount();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('re-enables error retry after a recovered event following completion', async () => {
    let streamSubscriber: ZenObservable.SubscriptionObserver<LogEvent>;
    const mockApi = {
      getTask: jest.fn().mockResolvedValue(
        makeTask({
          spec: {
            apiVersion: 'scaffolder.backstage.io/v1beta3',
            parameters: {},
            steps: [{ id: 'step-1', name: 'Step 1', action: 'debug:log' }],
            output: {},
            EXPERIMENTAL_recovery: {
              EXPERIMENTAL_strategy: 'startOver',
            },
          } as ScaffolderTask['spec'],
        }),
      ),
      streamLogs: jest.fn().mockImplementation(
        () =>
          new ObservableImpl<LogEvent>(subscriber => {
            streamSubscriber = subscriber;
          }),
      ),
    };

    const { result } = setup(mockApi);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    act(() => {
      streamSubscriber.next({
        id: 1,
        taskId: 'test-task-id',
        type: 'completion',
        createdAt: '2026-01-01T00:00:00Z',
        body: { output: {} },
      } as unknown as LogEvent);
    });

    expect(result.current.completed).toBe(true);

    act(() => {
      streamSubscriber.next({
        id: 2,
        taskId: 'test-task-id',
        type: 'recovered',
        createdAt: '2026-01-01T00:00:00Z',
        body: { message: 'Task recovered' },
      } as unknown as LogEvent);
    });

    expect(result.current.completed).toBe(false);

    act(() => {
      streamSubscriber.error(new Error('connection lost'));
    });

    await act(async () => {
      jest.advanceTimersByTime(15000);
    });

    expect(mockApi.streamLogs).toHaveBeenCalledTimes(2);
  });

  it('does not retry after stream completes via cancellation', async () => {
    let streamSubscriber: ZenObservable.SubscriptionObserver<LogEvent>;
    const mockApi = {
      getTask: jest.fn().mockResolvedValue(makeTask()),
      streamLogs: jest.fn().mockImplementation(
        () =>
          new ObservableImpl<LogEvent>(subscriber => {
            streamSubscriber = subscriber;
          }),
      ),
    };

    const { result } = setup(mockApi);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    act(() => {
      streamSubscriber.next(makeLogEvent(1, 'before cancel'));
    });

    act(() => {
      streamSubscriber.next({
        id: 2,
        taskId: 'test-task-id',
        type: 'cancelled',
        createdAt: '2026-01-01T00:00:00Z',
        body: { message: 'Task cancelled' },
      } as unknown as LogEvent);
    });

    expect(result.current.cancelled).toBe(true);
    expect(result.current.stepLogs['step-1']).toContainEqual(
      expect.stringContaining('before cancel'),
    );

    act(() => {
      streamSubscriber.error(new Error('SSE connection closed'));
    });

    await act(async () => {
      jest.advanceTimersByTime(15000);
    });

    expect(mockApi.streamLogs).toHaveBeenCalledTimes(1);
  });
});

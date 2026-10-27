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

    await act(async () => {
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

  it('retries after transport error following completion on a recoverable task', async () => {
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

    await act(async () => {
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
      streamSubscriber.error(new Error('SSE connection closed'));
    });

    await act(async () => {
      jest.advanceTimersByTime(15000);
    });

    expect(mockApi.streamLogs).toHaveBeenCalledTimes(2);
    expect(result.current.error).toBeUndefined();
    expect(result.current.completed).toBe(false);
  });

  it('does not open a stream when getTask resolves after tab was hidden', async () => {
    let resolveGetTask: (task: ScaffolderTask) => void;
    const task = makeTask();
    const mockApi = {
      getTask: jest
        .fn()
        .mockImplementationOnce(
          () =>
            new Promise<ScaffolderTask>(resolve => {
              resolveGetTask = resolve;
            }),
        )
        .mockResolvedValue(task),
      streamLogs: jest.fn().mockImplementation(
        () =>
          new ObservableImpl<LogEvent>(() => {
            // no-op
          }),
      ),
    };

    setup(mockApi);

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockApi.getTask).toHaveBeenCalledTimes(1);
    expect(mockApi.streamLogs).not.toHaveBeenCalled();

    Object.defineProperty(document, 'hidden', {
      value: true,
      writable: true,
      configurable: true,
    });
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await act(async () => {
      resolveGetTask!(task);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockApi.streamLogs).not.toHaveBeenCalled();

    Object.defineProperty(document, 'hidden', {
      value: false,
      writable: true,
      configurable: true,
    });
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(mockApi.getTask).toHaveBeenCalledTimes(2);
    expect(mockApi.streamLogs).toHaveBeenCalledTimes(1);
  });

  it.each([false, true])(
    'updates step states on cancellation (recoverable: %s)',
    async recoverable => {
      let subscriber: ZenObservable.SubscriptionObserver<LogEvent>;
      const unsubscribe = jest.fn();
      const task = makeTask();
      task.spec.steps = ['done', 'active', 'pending', 'failed', 'skipped'].map(
        id => ({ id, action: 'debug:log', name: id }),
      );
      if (recoverable)
        task.spec.EXPERIMENTAL_recovery = {
          EXPERIMENTAL_strategy: 'startOver',
        };
      const mockApi = {
        getTask: jest.fn().mockResolvedValue(task),
        streamLogs: jest.fn().mockImplementation(
          () =>
            new ObservableImpl<LogEvent>(observer => {
              subscriber = observer;
              return unsubscribe;
            }),
        ),
      };
      const { result } = setup(mockApi);
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
      });
      act(() => {
        for (const [i, [stepId, status]] of Object.entries({
          done: 'completed',
          active: 'processing',
          failed: 'failed',
          skipped: 'skipped',
        }).entries()) {
          subscriber.next({
            ...makeLogEvent(i + 1, stepId),
            body: { message: stepId, stepId, status },
          } as LogEvent);
        }
        subscriber.next({
          id: 5,
          taskId: task.id,
          type: 'cancelled',
          createdAt: '2026-01-01T00:00:05Z',
          body: { message: 'Cancelled' },
        } as LogEvent);
      });
      expect(result.current.cancelled).toBe(true);
      expect(result.current.task?.status).toBe('cancelled');
      expect(result.current.steps.active).toMatchObject({
        status: 'cancelled',
        startedAt: '2026-01-01T00:00:00Z',
        endedAt: '2026-01-01T00:00:05Z',
      });
      expect(result.current.steps.pending).toEqual({
        id: 'pending',
        status: 'skipped',
      });
      expect(result.current.steps.done).toMatchObject({
        status: 'completed',
        endedAt: '2026-01-01T00:00:00Z',
      });
      expect(result.current.steps.failed.status).toBe('failed');
      expect(result.current.steps.skipped.status).toBe('skipped');
      expect(unsubscribe).toHaveBeenCalledTimes(recoverable ? 0 : 1);
      expect(mockApi.streamLogs).toHaveBeenCalledTimes(1);
      if (recoverable) {
        act(() =>
          subscriber.next({
            id: 6,
            taskId: task.id,
            type: 'recovered',
            createdAt: '2026-01-01T00:00:06Z',
            body: { message: 'Recovered' },
          } as LogEvent),
        );
      }
      expect(result.current.cancelled).toBe(!recoverable);
      expect(result.current.task?.status).toBe(
        recoverable ? 'processing' : 'cancelled',
      );
      expect(result.current.steps.active).toMatchObject(
        recoverable
          ? {
              id: 'active',
              status: 'open',
              startedAt: undefined,
              endedAt: undefined,
            }
          : {
              id: 'active',
              status: 'cancelled',
              endedAt: '2026-01-01T00:00:05Z',
            },
      );
    },
  );

  it('tears down the subscription when a non-recoverable task is cancelled', async () => {
    let streamSubscriber: ZenObservable.SubscriptionObserver<LogEvent>;
    const unsubscribeSpy = jest.fn();
    const mockApi = {
      getTask: jest.fn().mockResolvedValue(makeTask()),
      streamLogs: jest.fn().mockImplementation(
        () =>
          new ObservableImpl<LogEvent>(subscriber => {
            streamSubscriber = subscriber;
            return () => unsubscribeSpy();
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
    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(mockApi.streamLogs).toHaveBeenCalledTimes(1);
  });

  it.each(['completed', 'failed', 'cancelled'] as const)(
    'restores %s task status after replaying recovery and completion',
    async status => {
      let subscriber: ZenObservable.SubscriptionObserver<LogEvent>;
      const task = makeTask({ status });
      task.spec.EXPERIMENTAL_recovery = {
        EXPERIMENTAL_strategy: 'startOver',
      };
      const error = new Error('Task failed');
      const output = { text: [{ title: 'Result', content: 'Done' }] };
      const mockApi = {
        getTask: jest.fn().mockResolvedValue(task),
        streamLogs: jest.fn().mockImplementation(
          () =>
            new ObservableImpl<LogEvent>(observer => {
              subscriber = observer;
            }),
        ),
      };
      const { result } = setup(mockApi);
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
      });
      act(() =>
        subscriber.next({
          id: 1,
          taskId: task.id,
          type: 'recovered',
          createdAt: '2026-01-01T00:00:01Z',
          body: { message: 'Recovered' },
        } as LogEvent),
      );
      expect(result.current.task?.status).toBe('processing');
      expect(result.current.completed).toBe(false);
      expect(result.current.cancelled).toBe(false);

      if (status === 'cancelled') {
        act(() =>
          subscriber.next({
            id: 2,
            taskId: task.id,
            type: 'cancelled',
            createdAt: '2026-01-01T00:00:02Z',
            body: { message: 'Cancelled' },
          } as LogEvent),
        );
      }
      await act(async () =>
        subscriber.next({
          id: 3,
          taskId: task.id,
          type: 'completion',
          createdAt: '2026-01-01T00:00:03Z',
          body: {
            message: 'Finished',
            output,
            error: status === 'completed' ? undefined : error,
          },
        } as LogEvent),
      );
      expect(result.current.task?.status).toBe(status);
      expect(result.current.completed).toBe(true);
      expect(result.current.cancelled).toBe(status === 'cancelled');
      expect(result.current.output).toEqual(output);
      expect(result.current.error).toBe(
        status === 'completed' ? undefined : error,
      );
    },
  );

  it.each(['processing', 'failed'] as const)(
    'uses the backend status for a message-only completion (initial: %s)',
    async status => {
      let subscriber: ZenObservable.SubscriptionObserver<LogEvent>;
      const task = makeTask({ status });
      task.spec.EXPERIMENTAL_recovery = {
        EXPERIMENTAL_strategy: 'startOver',
      };
      const mockApi = {
        getTask: jest
          .fn()
          .mockResolvedValueOnce(task)
          .mockResolvedValue(makeTask({ status: 'failed' })),
        streamLogs: jest.fn().mockImplementation(
          () =>
            new ObservableImpl<LogEvent>(observer => {
              subscriber = observer;
            }),
        ),
      };
      const { result } = setup(mockApi);
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
      });
      await act(async () => {
        subscriber.next({
          id: 1,
          taskId: task.id,
          type: 'recovered',
          createdAt: '2026-01-01T00:00:01Z',
          body: { message: 'Recovered' },
        } as LogEvent);
        subscriber.next({
          id: 2,
          taskId: task.id,
          type: 'completion',
          createdAt: '2026-01-01T00:00:02Z',
          body: { message: 'This task exceeded its timeout' },
        } as LogEvent);
      });
      expect(result.current.task?.status).toBe('failed');
      expect(result.current.completed).toBe(true);
      expect(result.current.cancelled).toBe(false);
      expect(result.current.error).toBeUndefined();
      expect(mockApi.getTask).toHaveBeenCalledTimes(2);
      expect(mockApi.getTask).toHaveBeenLastCalledWith(task.id);
    },
  );

  it.each([false, true])(
    'ignores an outdated completion status refresh (reject: %s)',
    async reject => {
      let subscriber: ZenObservable.SubscriptionObserver<LogEvent>;
      let resolveTask: (task: ScaffolderTask) => void;
      let rejectTask: (error: Error) => void;
      const task = makeTask();
      task.spec.EXPERIMENTAL_recovery = {
        EXPERIMENTAL_strategy: 'startOver',
      };
      const mockApi = {
        getTask: jest
          .fn()
          .mockResolvedValueOnce(task)
          .mockImplementation(
            () =>
              new Promise<ScaffolderTask>((resolve, rejectPromise) => {
                resolveTask = resolve;
                rejectTask = rejectPromise;
              }),
          ),
        streamLogs: jest.fn().mockImplementation(
          () =>
            new ObservableImpl<LogEvent>(observer => {
              subscriber = observer;
            }),
        ),
      };
      const { result } = setup(mockApi);
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
      });
      act(() => {
        subscriber.next({
          id: 1,
          taskId: task.id,
          type: 'completion',
          createdAt: '2026-01-01T00:00:01Z',
          body: { message: 'Finished' },
        } as LogEvent);
        subscriber.next({
          id: 2,
          taskId: task.id,
          type: 'recovered',
          createdAt: '2026-01-01T00:00:02Z',
          body: { message: 'Recovered' },
        } as LogEvent);
      });
      await act(async () => {
        if (reject) {
          rejectTask(new Error('Status refresh failed'));
        } else {
          resolveTask(makeTask({ status: 'failed' }));
        }
      });
      expect(result.current.task?.status).toBe('processing');
      expect(result.current.completed).toBe(false);
      expect(result.current.error).toBeUndefined();
    },
  );

  it('reports a failed status refresh without guessing the task outcome', async () => {
    let subscriber: ZenObservable.SubscriptionObserver<LogEvent>;
    const error = new Error('Could not fetch task status');
    const mockApi = {
      getTask: jest
        .fn()
        .mockResolvedValueOnce(makeTask())
        .mockRejectedValueOnce(error)
        .mockResolvedValue(makeTask({ status: 'failed' })),
      streamLogs: jest.fn().mockImplementation(
        () =>
          new ObservableImpl<LogEvent>(observer => {
            subscriber = observer;
          }),
      ),
    };
    const { result } = setup(mockApi);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    await act(async () => {
      subscriber.next({
        id: 1,
        taskId: 'test-task-id',
        type: 'completion',
        createdAt: '2026-01-01T00:00:01Z',
        body: { message: 'Finished', output: {} },
      } as LogEvent);
    });
    expect(result.current.task?.status).toBe('processing');
    expect(result.current.completed).toBe(true);
    expect(result.current.output).toEqual({});
    expect(result.current.error).toBe(error);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockApi.getTask).toHaveBeenCalledTimes(3);
    expect(result.current.task?.status).toBe('failed');
    expect(result.current.error).toBeUndefined();
  });

  function setupRecoverableStream() {
    const task = makeTask();
    task.spec.EXPERIMENTAL_recovery = {
      EXPERIMENTAL_strategy: 'startOver',
    };
    let subscriber: ZenObservable.SubscriptionObserver<LogEvent>;
    const mockApi = {
      getTask: jest.fn().mockResolvedValue(task),
      streamLogs: jest.fn().mockImplementation(
        () =>
          new ObservableImpl<LogEvent>(observer => {
            subscriber = observer;
          }),
      ),
    };
    return {
      ...setup(mockApi),
      mockApi,
      emit: (id: number, type: LogEvent['type'], body: LogEvent['body']) =>
        subscriber.next({
          id,
          taskId: task.id,
          type,
          createdAt: `2026-01-01T00:00:0${id}Z`,
          body,
        } as LogEvent),
    };
  }

  it('preserves cancellation through late failure logs and completion until recovery', async () => {
    const { result, mockApi, emit } = setupRecoverableStream();
    await act(async () => {
      await Promise.resolve();
    });
    mockApi.getTask.mockResolvedValue(makeTask({ status: 'failed' }));
    act(() => {
      emit(1, 'log', {
        message: 'Started',
        stepId: 'step-1',
        status: 'processing',
      });
      emit(2, 'cancelled', { message: 'Cancelled' });
    });
    await act(async () => {
      emit(3, 'log', {
        message: 'Aborted action',
        stepId: 'step-1',
        status: 'failed',
      });
      emit(4, 'completion', { message: 'Aborted workflow' });
    });
    expect(result.current.task?.status).toBe('cancelled');
    expect(result.current.cancelled).toBe(true);
    expect(result.current.steps['step-1']).toMatchObject({
      status: 'cancelled',
      startedAt: '2026-01-01T00:00:01Z',
      endedAt: '2026-01-01T00:00:02Z',
    });
    expect(result.current.stepLogs['step-1']).toContain(
      '2026-01-01T00:00:03Z Aborted action',
    );
    act(() => {
      emit(5, 'log', {
        message: 'Late abort',
        stepId: 'step-1',
        status: 'failed',
      });
      emit(6, 'recovered', { message: 'Recovered' });
      jest.advanceTimersByTime(500);
    });
    expect(result.current.steps['step-1']).toMatchObject({
      status: 'open',
      endedAt: undefined,
    });
    expect(result.current.stepLogs['step-1']).toContain(
      '2026-01-01T00:00:05Z Late abort',
    );
    act(() => {
      emit(7, 'log', {
        message: 'Restarted',
        stepId: 'step-1',
        status: 'processing',
      });
      jest.advanceTimersByTime(500);
    });
    expect(result.current.cancelled).toBe(false);
    expect(result.current.task?.status).toBe('processing');
    expect(result.current.steps['step-1']).toMatchObject({
      status: 'processing',
      startedAt: '2026-01-01T00:00:07Z',
      endedAt: undefined,
    });
  });

  it('deduplicates completions while a slow refresh is pending and after it succeeds', async () => {
    const { result, mockApi, emit } = setupRecoverableStream();
    await act(async () => {
      await Promise.resolve();
    });
    let resolveTask: (task: ScaffolderTask) => void;
    mockApi.getTask.mockImplementation(
      () =>
        new Promise<ScaffolderTask>(resolve => {
          resolveTask = resolve;
        }),
    );
    act(() => {
      emit(1, 'completion', { message: 'Finished' });
      for (let i = 0; i < 5; i++) {
        jest.advanceTimersByTime(1000);
        emit(1, 'completion', { message: 'Finished' });
      }
    });
    expect(mockApi.getTask).toHaveBeenCalledTimes(2);
    await act(async () => {
      resolveTask(makeTask({ status: 'failed' }));
    });
    expect(result.current.task?.status).toBe('failed');
    act(() => {
      emit(1, 'completion', { message: 'Finished' });
    });
    expect(mockApi.getTask).toHaveBeenCalledTimes(2);
    act(() => {
      emit(2, 'recovered', { message: 'Recovered' });
    });
    await act(async () => {
      emit(1, 'completion', { message: 'Finished' });
    });
    expect(result.current.task?.status).toBe('processing');
    expect(result.current.completed).toBe(false);
    expect(mockApi.getTask).toHaveBeenCalledTimes(2);
    act(() => {
      Object.defineProperty(document, 'hidden', {
        value: true,
        writable: true,
        configurable: true,
      });
      document.dispatchEvent(new Event('visibilitychange'));
      Object.defineProperty(document, 'hidden', {
        value: false,
        writable: true,
        configurable: true,
      });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(mockApi.streamLogs).toHaveBeenLastCalledWith(
      expect.objectContaining({ after: 2 }),
    );
    await act(async () => {
      emit(3, 'completion', { message: 'New outcome' });
      resolveTask(makeTask({ status: 'completed' }));
    });
    expect(mockApi.getTask).toHaveBeenCalledTimes(3);
    expect(result.current.task?.status).toBe('completed');
  });

  it('retries failed completion refreshes without duplicate requests and clears the refresh error', async () => {
    const { result, mockApi, emit } = setupRecoverableStream();
    await act(async () => {
      await Promise.resolve();
    });
    const error = new Error('Temporary API failure');
    mockApi.getTask
      .mockRejectedValueOnce(error)
      .mockResolvedValue(makeTask({ status: 'failed' }));
    await act(async () => {
      emit(1, 'completion', { message: 'Timed out' });
    });
    expect(result.current.error).toBe(error);
    act(() => {
      emit(1, 'completion', { message: 'Timed out' });
    });
    expect(mockApi.getTask).toHaveBeenCalledTimes(2);
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockApi.getTask).toHaveBeenCalledTimes(3);
    expect(result.current.task?.status).toBe('failed');
    expect(result.current.error).toBeUndefined();
    act(() => {
      emit(1, 'completion', { message: 'Timed out' });
      jest.advanceTimersByTime(10000);
    });
    expect(mockApi.getTask).toHaveBeenCalledTimes(3);
  });

  it('bounds status refresh retries even if completion keeps repeating', async () => {
    const { result, mockApi, emit } = setupRecoverableStream();
    await act(async () => {
      await Promise.resolve();
    });
    const error = new Error('API unavailable');
    mockApi.getTask.mockRejectedValue(error);
    await act(async () => {
      emit(1, 'completion', { message: 'Finished' });
    });
    for (let i = 0; i < 6; i++) {
      await act(async () => {
        emit(1, 'completion', { message: 'Finished' });
        jest.advanceTimersByTime(1000);
      });
    }
    expect(mockApi.getTask).toHaveBeenCalledTimes(5);
    expect(result.current.error).toBe(error);
  });

  it.each(['recovered', 'cancelled', 'unmount'] as const)(
    'cancels pending status retries on %s',
    async change => {
      const { mockApi, emit, unmount } = setupRecoverableStream();
      await act(async () => {
        await Promise.resolve();
      });
      mockApi.getTask.mockRejectedValue(new Error('Temporary API failure'));
      await act(async () => {
        emit(1, 'completion', { message: 'Finished' });
      });
      act(() => {
        if (change === 'unmount') unmount();
        else emit(2, change, { message: change });
      });
      await act(async () => {
        jest.advanceTimersByTime(10000);
      });
      expect(mockApi.getTask).toHaveBeenCalledTimes(2);
    },
  );

  it.each([false, true])(
    'retries an interrupted refresh after reconnect (reject old request: %s)',
    async reject => {
      const { result, mockApi, emit } = setupRecoverableStream();
      await act(async () => {
        await Promise.resolve();
      });
      let resolveTask: (task: ScaffolderTask) => void;
      let rejectTask: (error: Error) => void;
      mockApi.getTask
        .mockImplementationOnce(
          () =>
            new Promise<ScaffolderTask>((resolve, rejectPromise) => {
              resolveTask = resolve;
              rejectTask = rejectPromise;
            }),
        )
        .mockResolvedValue(makeTask({ status: 'failed' }));
      act(() => {
        emit(1, 'completion', { message: 'Finished' });
      });
      act(() => {
        Object.defineProperty(document, 'hidden', {
          value: true,
          writable: true,
          configurable: true,
        });
        document.dispatchEvent(new Event('visibilitychange'));
        Object.defineProperty(document, 'hidden', {
          value: false,
          writable: true,
          configurable: true,
        });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await act(async () => {
        emit(1, 'completion', { message: 'Finished' });
      });
      expect(mockApi.getTask).toHaveBeenCalledTimes(3);
      expect(result.current.task?.status).toBe('failed');
      await act(async () => {
        if (reject) rejectTask(new Error('Old request failed'));
        else resolveTask(makeTask({ status: 'completed' }));
      });
      expect(result.current.task?.status).toBe('failed');
      expect(result.current.error).toBeUndefined();
      expect(mockApi.streamLogs).toHaveBeenLastCalledWith(
        expect.objectContaining({ after: 1 }),
      );
    },
  );

  it('tears down the subscription when a non-recoverable task completes', async () => {
    let streamSubscriber: ZenObservable.SubscriptionObserver<LogEvent>;
    const unsubscribeSpy = jest.fn();
    const mockApi = {
      getTask: jest.fn().mockResolvedValue(makeTask()),
      streamLogs: jest.fn().mockImplementation(
        () =>
          new ObservableImpl<LogEvent>(subscriber => {
            streamSubscriber = subscriber;
            return () => unsubscribeSpy();
          }),
      ),
    };

    const { result } = setup(mockApi);

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    await act(async () => {
      streamSubscriber.next({
        id: 1,
        taskId: 'test-task-id',
        type: 'completion',
        createdAt: '2026-01-01T00:00:00Z',
        body: { output: {} },
      } as unknown as LogEvent);
    });

    expect(result.current.completed).toBe(true);
    expect(unsubscribeSpy).toHaveBeenCalled();
    expect(mockApi.streamLogs).toHaveBeenCalledTimes(1);
  });
});

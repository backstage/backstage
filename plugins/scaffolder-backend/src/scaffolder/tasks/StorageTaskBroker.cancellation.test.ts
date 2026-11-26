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

import { mockServices } from '@backstage/backend-test-utils';
import { StorageTaskBroker } from './StorageTaskBroker';
import { TaskStore } from './types';

describe('StorageTaskBroker cancellation watcher lifecycle', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  function setup() {
    const listEvents = jest.fn().mockResolvedValue({
      events: [
        {
          id: 1,
          type: 'completion',
          taskId: 'task',
          body: {},
          createdAt: '',
          isTaskRecoverable: true,
        },
      ],
    });
    const storage = {
      claimTask: jest
        .fn()
        .mockResolvedValue({ id: 'task', spec: { steps: [] } }),
      getTask: jest.fn().mockResolvedValue({
        spec: {
          EXPERIMENTAL_recovery: { EXPERIMENTAL_strategy: 'startOver' },
        },
      }),
      listEvents,
      heartbeatTask: jest.fn().mockResolvedValue(undefined),
      completeTask: jest.fn().mockResolvedValue(undefined),
    } as unknown as TaskStore;
    return {
      broker: new StorageTaskBroker(storage, mockServices.logger.mock()),
      listEvents,
      storage,
    };
  }

  it.each(['completed', 'failed'] as const)(
    'stops polling when a recoverable run is %s',
    async result => {
      const { broker, listEvents } = setup();
      const task = await broker.claim();
      await jest.advanceTimersByTimeAsync(2500);
      await task.complete(result);
      const polls = listEvents.mock.calls.length;
      await jest.advanceTimersByTimeAsync(3000);
      expect(listEvents).toHaveBeenCalledTimes(polls);
    },
  );

  it('ignores a previous run completion and still cancels the retried run', async () => {
    const { broker, listEvents } = setup();
    const first = await broker.claim();
    await jest.advanceTimersByTimeAsync(0);
    await first.complete('failed');
    const retry = await broker.claim();
    await jest.advanceTimersByTimeAsync(0);
    expect(retry.cancelSignal.aborted).toBe(false);
    listEvents.mockResolvedValue({
      events: [
        { id: 2, type: 'cancelled', taskId: 'task', body: {}, createdAt: '' },
      ],
    });
    await jest.advanceTimersByTimeAsync(1000);
    expect(retry.cancelSignal.aborted).toBe(true);
    await retry.complete('failed');
  });

  it('stops polling when the run loses its heartbeat', async () => {
    const { broker, listEvents, storage } = setup();
    jest
      .mocked(storage.heartbeatTask)
      .mockRejectedValue(new Error('lost claim'));
    await broker.claim();
    await jest.advanceTimersByTimeAsync(1500);
    const polls = listEvents.mock.calls.length;
    await jest.advanceTimersByTimeAsync(3000);
    expect(listEvents).toHaveBeenCalledTimes(polls);
  });
});

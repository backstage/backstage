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
import { SerializedTaskEvent } from '@backstage/plugin-scaffolder-node';
import { StorageTaskBroker } from './StorageTaskBroker';
import { TaskStore } from './types';

const event = (
  id: number,
  type: SerializedTaskEvent['type'],
): SerializedTaskEvent => ({
  id,
  type,
  taskId: 'task',
  createdAt: '',
  body: {},
});

describe('StorageTaskBroker completion delivery', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  function setup() {
    const listEvents = jest
      .fn()
      .mockResolvedValue({ events: [event(10, 'completion')] });
    const storage = {
      getTask: jest.fn().mockResolvedValue({
        spec: { EXPERIMENTAL_recovery: { EXPERIMENTAL_strategy: 'startOver' } },
      }),
      listEvents,
    } as unknown as TaskStore;
    const broker = new StorageTaskBroker(storage, mockServices.logger.mock());
    return { broker, listEvents };
  }

  it('delivers an old completion once per connection without moving the cursor backwards', async () => {
    const { broker, listEvents } = setup();
    const next = jest.fn();
    const subscription = broker
      .event$({ taskId: 'task', after: 20 })
      .subscribe(next);
    await jest.advanceTimersByTimeAsync(2500);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith({ events: [event(10, 'completion')] });
    expect(listEvents).toHaveBeenCalledTimes(3);
    expect(listEvents).toHaveBeenLastCalledWith({
      taskId: 'task',
      after: 20,
      isTaskRecoverable: true,
    });
    subscription.unsubscribe();

    const reconnect = jest.fn();
    const reconnected = broker
      .event$({ taskId: 'task', after: 20 })
      .subscribe(reconnect);
    await jest.advanceTimersByTimeAsync(0);
    expect(reconnect).toHaveBeenCalledWith({
      events: [event(10, 'completion')],
    });
    reconnected.unsubscribe();
  });

  it('keeps delivering new events and completions after a retry', async () => {
    const { broker, listEvents } = setup();
    listEvents
      .mockResolvedValueOnce({ events: [event(10, 'completion')] })
      .mockResolvedValueOnce({ events: [event(10, 'completion')] })
      .mockResolvedValueOnce({
        events: [event(11, 'recovered'), event(12, 'log')],
      })
      .mockResolvedValue({ events: [event(13, 'completion')] });
    const next = jest.fn();
    const subscription = broker.event$({ taskId: 'task' }).subscribe(next);
    await jest.advanceTimersByTimeAsync(4500);

    expect(next.mock.calls.map(([batch]) => batch.events)).toEqual([
      [event(10, 'completion')],
      [event(11, 'recovered'), event(12, 'log')],
      [event(13, 'completion')],
    ]);
    subscription.unsubscribe();
    const polls = listEvents.mock.calls.length;
    await jest.advanceTimersByTimeAsync(2000);
    expect(listEvents).toHaveBeenCalledTimes(polls);
  });
});

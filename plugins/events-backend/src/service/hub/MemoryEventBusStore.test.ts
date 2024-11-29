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
import { EventParams } from '@backstage/plugin-events-node';
import { MemoryEventBusStore } from './MemoryEventBusStore';
import { mockCredentials } from '@backstage/backend-test-utils';

function mkEvent(message: string): EventParams {
  return {
    topic: 'test',
    eventPayload: { message },
  };
}

describe('MemoryEventBusStore', () => {
  it('should publish to subscribers', async () => {
    const store = new MemoryEventBusStore();

    await expect(
      store.publish({
        event: mkEvent('hello'),
        notifiedSubscribers: [],
        credentials: mockCredentials.service(),
      }),
    ).resolves.toEqual(undefined);

    await expect(store.readSubscription('test')).rejects.toThrow(
      'Subscription not found',
    );

    await store.upsertSubscription('tester', ['test']);

    await expect(
      store.publish({
        event: mkEvent('hello'),
        notifiedSubscribers: [],
        credentials: mockCredentials.service(),
      }),
    ).resolves.toEqual({ eventId: '1' });

    await expect(
      store.publish({
        event: mkEvent('ignored'),
        notifiedSubscribers: ['tester'],
        credentials: mockCredentials.service(),
      }),
    ).resolves.toEqual(undefined);

    await expect(store.readSubscription('tester')).resolves.toEqual({
      events: [mkEvent('hello')],
    });
  });

  it('should clean up old events', async () => {
    const store = new MemoryEventBusStore({ maxEvents: 5 });

    await store.upsertSubscription('tester', ['test']);

    for (let i = 0; i < 20; ++i) {
      await expect(
        store.publish({
          event: mkEvent(`hello ${i}`),
          notifiedSubscribers: [],
          credentials: mockCredentials.service(),
        }),
      ).resolves.toEqual({ eventId: String(i + 1) });
    }

    await expect(store.readSubscription('tester')).resolves.toEqual({
      events: [
        mkEvent('hello 15'),
        mkEvent('hello 16'),
        mkEvent('hello 17'),
        mkEvent('hello 18'),
        mkEvent('hello 19'),
      ],
    });
  });
});

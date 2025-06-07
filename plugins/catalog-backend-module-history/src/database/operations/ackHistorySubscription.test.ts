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

import { TestDatabases } from '@backstage/backend-test-utils';
import { initEmptyDatabase } from '../../__fixtures__/initEmptyDatabase';
import { ackHistorySubscription } from './ackHistorySubscription';
import { getSubscription } from './getSubscription';

jest.setTimeout(60_000);

describe('ackHistorySubscription', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    'should ack a history subscription, %p',
    async databaseId => {
      const { knex, shutdown } = await initEmptyDatabase(databases, databaseId);

      await knex('history_subscriptions').insert([
        {
          subscription_id: 'idle',
          state: 'idle',
          last_sent_event_id: '1',
          last_acknowledged_event_id: '0',
        },
        {
          subscription_id: 'waiting1',
          state: 'waiting',
          ack_id: 'ack1',
          ack_timeout_at: new Date(),
          last_sent_event_id: '1',
          last_acknowledged_event_id: '0',
        },
        {
          subscription_id: 'waiting2',
          state: 'waiting',
          ack_id: 'ack2',
          ack_timeout_at: new Date(),
          last_sent_event_id: '1',
          last_acknowledged_event_id: '0',
        },
      ]);

      await expect(
        ackHistorySubscription(knex, { subscriptionId: 'idle', ackId: 'fboo' }),
      ).resolves.toBeFalsy();
      await expect(
        ackHistorySubscription(knex, {
          subscriptionId: 'waiting1',
          ackId: 'ack2',
        }),
      ).resolves.toBeFalsy();
      await expect(
        ackHistorySubscription(knex, {
          subscriptionId: 'waiting2',
          ackId: 'ack1',
        }),
      ).resolves.toBeFalsy();

      await expect(getSubscription(knex, 'idle')).resolves.toMatchObject({
        subscriptionId: 'idle',
        state: 'idle',
        lastSentEventId: '1',
        lastAcknowledgedEventId: '0',
      });

      await expect(getSubscription(knex, 'waiting1')).resolves.toMatchObject({
        subscriptionId: 'waiting1',
        state: 'waiting',
        ackId: 'ack1',
        ackTimeoutAt: expect.anything(),
        lastSentEventId: '1',
        lastAcknowledgedEventId: '0',
      });

      await expect(getSubscription(knex, 'waiting2')).resolves.toMatchObject({
        subscriptionId: 'waiting2',
        state: 'waiting',
        ackId: 'ack2',
        ackTimeoutAt: expect.anything(),
        lastSentEventId: '1',
        lastAcknowledgedEventId: '0',
      });

      await expect(
        ackHistorySubscription(knex, {
          subscriptionId: 'waiting1',
          ackId: 'ack1',
        }),
      ).resolves.toBeTruthy();

      await expect(getSubscription(knex, 'idle')).resolves.toMatchObject({
        subscriptionId: 'idle',
        state: 'idle',
        lastSentEventId: '1',
        lastAcknowledgedEventId: '0',
      });

      await expect(getSubscription(knex, 'waiting1')).resolves.toMatchObject({
        subscriptionId: 'waiting1',
        state: 'idle',
        lastSentEventId: '1',
        lastAcknowledgedEventId: '1',
      });

      await expect(getSubscription(knex, 'waiting2')).resolves.toMatchObject({
        subscriptionId: 'waiting2',
        state: 'waiting',
        ackId: 'ack2',
        ackTimeoutAt: expect.anything(),
        lastSentEventId: '1',
        lastAcknowledgedEventId: '0',
      });

      await shutdown();
    },
  );
});

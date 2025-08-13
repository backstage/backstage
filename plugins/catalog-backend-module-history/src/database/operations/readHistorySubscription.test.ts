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
import { NotFoundError } from '@backstage/errors';
import { initEmptyDatabase } from '../../__fixtures__/initEmptyDatabase';
import { getHistoryConfig } from '../../config';
import { getSubscription } from './getSubscription';
import { readHistorySubscription } from './readHistorySubscription';

jest.setTimeout(60_000);

describe('readHistorySubscription', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    'throws NotFound when there is no such subscription, %p',
    async databaseId => {
      const { knex, shutdown } = await initEmptyDatabase(databases, databaseId);

      await expect(
        readHistorySubscription(knex, {
          subscriptionId: 'test',
          operation: 'read',
          limit: 10,
          historyConfig: getHistoryConfig(),
        }),
      ).rejects.toThrow(NotFoundError);

      await shutdown();
    },
  );

  it.each(databases.eachSupportedId())(
    'reads events as expected, %p',
    async databaseId => {
      const { knex, shutdown } = await initEmptyDatabase(databases, databaseId);

      await knex('history_subscriptions').insert({
        subscription_id: 'test',
        state: 'idle',
        last_sent_event_id: 0,
        last_acknowledged_event_id: 0,
      });

      await knex('history_events').insert([
        { event_type: 'type1' },
        { event_type: 'type2' },
        { event_type: 'type3' },
      ]);

      // First peek succeeds
      await expect(
        readHistorySubscription(knex, {
          subscriptionId: 'test',
          operation: 'peek',
          limit: 1,
          historyConfig: getHistoryConfig(),
        }),
      ).resolves.toEqual({
        events: [
          {
            eventId: '1',
            eventType: 'type1',
            eventAt: expect.any(Date),
          },
        ],
        ackId: expect.any(String),
      });

      // And then the subscription stays intact
      await expect(getSubscription(knex, 'test')).resolves.toEqual({
        subscriptionId: 'test',
        activeAt: expect.any(Date),
        createdAt: expect.any(Date),
        state: 'idle',
        lastSentEventId: '0',
        lastAcknowledgedEventId: '0',
      });

      // First read succeeds
      await expect(
        readHistorySubscription(knex, {
          subscriptionId: 'test',
          operation: 'read',
          limit: 1,
          historyConfig: getHistoryConfig(),
        }),
      ).resolves.toEqual({
        events: [
          {
            eventId: '1',
            eventType: 'type1',
            eventAt: expect.any(Date),
          },
        ],
        ackId: expect.any(String),
      });

      // Which moves forward the subscription and marks it as waiting
      await expect(getSubscription(knex, 'test')).resolves.toEqual({
        subscriptionId: 'test',
        activeAt: expect.any(Date),
        createdAt: expect.any(Date),
        state: 'waiting',
        ackId: expect.any(String),
        ackTimeoutAt: expect.any(Date),
        lastSentEventId: '1',
        lastAcknowledgedEventId: '0',
      });

      // Immediate following read fails because the subscription is not idle
      await expect(
        readHistorySubscription(knex, {
          subscriptionId: 'test',
          operation: 'read',
          limit: 1,
          historyConfig: getHistoryConfig(),
        }),
      ).resolves.toBeUndefined();

      // And also peek
      await expect(
        readHistorySubscription(knex, {
          subscriptionId: 'test',
          operation: 'peek',
          limit: 1,
          historyConfig: getHistoryConfig(),
        }),
      ).resolves.toBeUndefined();

      // And then the subscription stays intact
      await expect(getSubscription(knex, 'test')).resolves.toEqual({
        subscriptionId: 'test',
        activeAt: expect.any(Date),
        createdAt: expect.any(Date),
        state: 'waiting',
        ackId: expect.any(String),
        ackTimeoutAt: expect.any(Date),
        lastSentEventId: '1',
        lastAcknowledgedEventId: '0',
      });

      // Manually acknowledge
      await knex('history_subscriptions')
        .update({
          state: 'idle',
          ack_id: null,
          ack_timeout_at: null,
          last_acknowledged_event_id: knex.ref('last_sent_event_id'),
        })
        .where('subscription_id', '=', 'test');

      // Now read succeeds
      await expect(
        readHistorySubscription(knex, {
          subscriptionId: 'test',
          operation: 'read',
          limit: 3,
          historyConfig: getHistoryConfig(),
        }),
      ).resolves.toEqual({
        events: [
          {
            eventId: '2',
            eventType: 'type2',
            eventAt: expect.any(Date),
          },
          {
            eventId: '3',
            eventType: 'type3',
            eventAt: expect.any(Date),
          },
        ],
        ackId: expect.any(String),
      });

      // And then the subscription moved forward
      await expect(getSubscription(knex, 'test')).resolves.toEqual({
        subscriptionId: 'test',
        activeAt: expect.any(Date),
        createdAt: expect.any(Date),
        state: 'waiting',
        ackId: expect.any(String),
        ackTimeoutAt: expect.any(Date),
        lastSentEventId: '3',
        lastAcknowledgedEventId: '1',
      });

      await shutdown();
    },
  );
});

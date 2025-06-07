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

import {
  mockServices,
  startTestBackend,
  TestBackend,
  TestDatabaseId,
  TestDatabases,
} from '@backstage/backend-test-utils';
import { NotFoundError } from '@backstage/errors';
import catalogBackend from '@backstage/plugin-catalog-backend';
import { Knex } from 'knex';
import { createMockEntityProvider } from '../../__fixtures__/createMockEntityProvider';
import { applyDatabaseMigrations } from '../../database/migrations';
import { AckSubscriptionModelImpl } from './AckSubscription.model';
import { getSubscription } from '../../database/operations/getSubscription';

jest.setTimeout(60_000);

describe('AckSubscriptionModel', () => {
  const databases = TestDatabases.create();

  // Helper to ensure the catalog is started and our migrations are applied
  async function init(databaseId: TestDatabaseId): Promise<{
    knex: Knex;
    backend: TestBackend;
  }> {
    const knex = await databases.init(databaseId);
    const provider = createMockEntityProvider();
    const backend = await startTestBackend({
      features: [
        mockServices.database.factory({ knex }),
        catalogBackend,
        provider,
      ],
    });
    await provider.ready;
    await applyDatabaseMigrations(knex);
    return { knex, backend };
  }

  it.each(databases.eachSupportedId())(
    'should ack a history subscription, %p',
    async databaseId => {
      const { knex, backend } = await init(databaseId);

      const model = new AckSubscriptionModelImpl({
        knexPromise: Promise.resolve(knex),
      });

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
        model.ackSubscription({
          ackOptions: { subscriptionId: 'idle', ackId: 'fboo' },
        }),
      ).resolves.toBeFalsy();
      await expect(
        model.ackSubscription({
          ackOptions: { subscriptionId: 'waiting1', ackId: 'ack2' },
        }),
      ).resolves.toBeFalsy();
      await expect(
        model.ackSubscription({
          ackOptions: { subscriptionId: 'waiting2', ackId: 'ack1' },
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
        ackTimeoutAt: expect.any(Date),
        lastSentEventId: '1',
        lastAcknowledgedEventId: '0',
      });

      await expect(getSubscription(knex, 'waiting2')).resolves.toMatchObject({
        subscriptionId: 'waiting2',
        state: 'waiting',
        ackId: 'ack2',
        ackTimeoutAt: expect.any(Date),
        lastSentEventId: '1',
        lastAcknowledgedEventId: '0',
      });

      await expect(
        model.ackSubscription({
          ackOptions: { subscriptionId: 'waiting1', ackId: 'ack1' },
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
        ackTimeoutAt: expect.any(Date),
        lastSentEventId: '1',
        lastAcknowledgedEventId: '0',
      });

      await backend.stop();
    },
  );
});

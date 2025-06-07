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
import { applyDatabaseMigrations } from '../migrations';
import { getSubscription } from './getSubscription';

jest.setTimeout(60_000);

describe('getSubscription', () => {
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
    'should return a subscription or throw NotFoundError, %p',
    async databaseId => {
      const { knex, backend } = await init(databaseId);

      await knex('history_subscriptions').insert({
        subscription_id: 'foo',
        state: 'idle',
        last_sent_event_id: '0',
        last_acknowledged_event_id: '0',
      });

      await expect(getSubscription(knex, 'foo')).resolves.toMatchObject({
        subscriptionId: 'foo',
        state: 'idle',
        lastSentEventId: '0',
        lastAcknowledgedEventId: '0',
      });

      await expect(getSubscription(knex, 'bar')).rejects.toThrow(NotFoundError);

      await backend.stop();
      await knex.destroy();
    },
  );
});

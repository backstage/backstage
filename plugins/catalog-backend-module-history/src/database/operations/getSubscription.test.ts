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
import { getSubscription } from './getSubscription';

jest.setTimeout(60_000);

describe('getSubscription', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    'should return a subscription or throw NotFoundError, %p',
    async databaseId => {
      const { knex, shutdown } = await initEmptyDatabase(databases, databaseId);

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

      await shutdown();
    },
  );
});

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
  TestBackend,
  TestDatabaseId,
  TestDatabases,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import catalogBackend from '@backstage/plugin-catalog-backend';
import { Knex } from 'knex';
import { createMockEntityProvider } from '../__fixtures__/createMockEntityProvider';
import { getHistoryConfig } from '../config';
import { applyDatabaseMigrations } from '../database/migrations';
import { EventsTableRow } from '../database/tables';
import { HistoryEventEmitter } from './HistoryEventEmitter';
import waitFor from 'wait-for-expect';

jest.setTimeout(60_000);

describe('HistoryEventEmitter', () => {
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
    'should emit events, %p',
    async databaseId => {
      const { knex, backend } = await init(databaseId);
      const shutdown = new AbortController();
      const lifecycle = mockServices.lifecycle.mock();
      const events = mockServices.events.mock();

      await knex<EventsTableRow>('module_history__events').insert({
        event_type: 'entity_created',
        entity_ref: 'component:default/foo',
        entity_id: 'foo',
        entity_json: JSON.stringify({ kind: 'Component' }),
        location_id: 'bar',
        location_ref: 'url:http://mockEntityProvider.com',
      });

      HistoryEventEmitter.create({
        knexPromise: Promise.resolve(knex),
        lifecycle,
        events,
        historyConfig: getHistoryConfig({
          overrides: {
            blockDuration: { seconds: 1 },
            blockPollFrequency: { milliseconds: 100 },
          },
        }),
      });

      await waitFor(() => {
        expect(events.publish).toHaveBeenCalledWith({
          topic: 'backstage.catalog.history.event',
          eventPayload: {
            eventId: '1',
            eventAt: expect.any(String),
            eventType: 'entity_created',
            entityRef: 'component:default/foo',
            entityId: 'foo',
            entityJson: { kind: 'Component' },
            locationId: 'bar',
            locationRef: 'url:http://mockEntityProvider.com',
          },
          metadata: {
            eventType: 'entity_created',
          },
        });
      });

      shutdown.abort();
      await backend.stop();
    },
  );
});

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
import catalogBackend from '@backstage/plugin-catalog-backend';
import { Knex } from 'knex';
import { createMockEntityProvider } from '../../__fixtures__/createMockEntityProvider';
import { applyDatabaseMigrations } from '../migrations';
import { readHistoryEvents } from './readHistoryEvents';

jest.setTimeout(60_000);

describe('readHistoryEvents', () => {
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

  // Upserts an enitity into the catalog
  async function setEntity(knex: Knex, name: string, data: number) {
    const ref = `k:ns/${name}`;
    const id = `id-${name}`;

    await knex('refresh_state')
      .insert({
        entity_id: id,
        entity_ref: ref,
        unprocessed_entity: JSON.stringify({ data }),
        errors: '{}',
        last_discovery_at: knex.fn.now(),
        next_update_at: knex.fn.now(),
      })
      .onConflict(['entity_ref'])
      .ignore();

    await knex('final_entities')
      .insert({
        entity_id: id,
        entity_ref: ref,
        stitch_ticket: 'a',
        hash: 'b',
        final_entity: JSON.stringify({ data }),
      })
      .onConflict('entity_id')
      .merge(['final_entity']);
  }

  it.each(databases.eachSupportedId())(
    'reads properly from empty table and then with content, %p',
    async databaseId => {
      const { knex, backend } = await init(databaseId);

      await expect(
        readHistoryEvents(knex, {
          order: 'asc',
          limit: 10,
        }),
      ).resolves.toEqual([]);

      await setEntity(knex, 'foo', 1);

      await expect(
        readHistoryEvents(knex, { order: 'asc', limit: 10 }),
      ).resolves.toEqual([
        {
          eventId: '1',
          eventType: 'entity_created',
          eventAt: expect.any(Date),
          entityRef: 'k:ns/foo',
          entityId: 'id-foo',
          entityJson: '{"data":1}',
        },
      ]);

      await backend.stop();
    },
  );

  it.each(databases.eachSupportedId())(
    'reads reverse with limit and stops when no more data, %p',
    async databaseId => {
      const { knex, backend } = await init(databaseId);

      await setEntity(knex, 'foo', 1);
      await setEntity(knex, 'foo', 2);
      await setEntity(knex, 'foo', 3);

      await expect(
        readHistoryEvents(knex, { order: 'desc', limit: 2 }),
      ).resolves.toEqual([
        {
          eventId: '3',
          eventType: 'entity_updated',
          eventAt: expect.any(Date),
          entityRef: 'k:ns/foo',
          entityId: 'id-foo',
          entityJson: '{"data":3}',
        },
        {
          eventId: '2',
          eventType: 'entity_updated',
          eventAt: expect.any(Date),
          entityRef: 'k:ns/foo',
          entityId: 'id-foo',
          entityJson: '{"data":2}',
        },
      ]);

      await expect(
        readHistoryEvents(knex, { afterEventId: '2', order: 'desc', limit: 2 }),
      ).resolves.toEqual([
        {
          eventId: '1',
          eventType: 'entity_created',
          eventAt: expect.any(Date),
          entityRef: 'k:ns/foo',
          entityId: 'id-foo',
          entityJson: '{"data":1}',
        },
      ]);

      await expect(
        readHistoryEvents(knex, {
          afterEventId: '2',
          order: 'desc',
          limit: 2,
          entityId: 'wrong',
        }),
      ).resolves.toEqual([]);

      await backend.stop();
    },
  );

  it.each(databases.eachSupportedId())('filters, %p', async databaseId => {
    const { knex, backend } = await init(databaseId);

    await setEntity(knex, 'foo', 1);
    await setEntity(knex, 'bar', 2);

    await expect(
      readHistoryEvents(knex, {
        order: 'asc',
        limit: 2,
        entityRef: 'k:ns/foo',
      }),
    ).resolves.toEqual([
      {
        eventId: '1',
        eventType: 'entity_created',
        eventAt: expect.any(Date),
        entityRef: 'k:ns/foo',
        entityId: 'id-foo',
        entityJson: '{"data":1}',
      },
    ]);

    await expect(
      readHistoryEvents(knex, {
        order: 'asc',
        limit: 2,
        entityRef: 'k:ns/bar',
      }),
    ).resolves.toEqual([
      {
        eventId: '2',
        eventType: 'entity_created',
        eventAt: expect.any(Date),
        entityRef: 'k:ns/bar',
        entityId: 'id-bar',
        entityJson: '{"data":2}',
      },
    ]);

    await expect(
      readHistoryEvents(knex, {
        order: 'asc',
        limit: 2,
        entityRef: 'wrong',
      }),
    ).resolves.toEqual([]);

    await expect(
      readHistoryEvents(knex, {
        order: 'asc',
        limit: 2,
        entityId: 'id-foo',
      }),
    ).resolves.toEqual([
      {
        eventId: '1',
        eventType: 'entity_created',
        eventAt: expect.any(Date),
        entityRef: 'k:ns/foo',
        entityId: 'id-foo',
        entityJson: '{"data":1}',
      },
    ]);

    await expect(
      readHistoryEvents(knex, {
        order: 'asc',
        limit: 2,
        entityId: 'id-bar',
      }),
    ).resolves.toEqual([
      {
        eventId: '2',
        eventType: 'entity_created',
        eventAt: expect.any(Date),
        entityRef: 'k:ns/bar',
        entityId: 'id-bar',
        entityJson: '{"data":2}',
      },
    ]);

    await expect(
      readHistoryEvents(knex, {
        order: 'asc',
        limit: 2,
        entityId: 'wrong',
      }),
    ).resolves.toEqual([]);

    await backend.stop();
  });
});

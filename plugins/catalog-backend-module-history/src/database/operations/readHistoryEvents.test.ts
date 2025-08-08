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
import { Knex } from 'knex';
import waitFor from 'wait-for-expect';
import { initEmptyDatabase } from '../../__fixtures__/initEmptyDatabase';
import { readHistoryEvents } from './readHistoryEvents';

jest.setTimeout(60_000);

describe('readHistoryEvents', () => {
  const databases = TestDatabases.create();

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

    await knex('search').insert({
      entity_id: id,
      key: 'data',
      value: String(data),
      original_value: String(data),
    });
  }

  it.each(databases.eachSupportedId())(
    'reads properly from empty table and then with content, %p',
    async databaseId => {
      const { knex, shutdown } = await initEmptyDatabase(databases, databaseId);

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

      await shutdown();
    },
  );

  it.each(databases.eachSupportedId())(
    'reads reverse with limit and stops when no more data, %p',
    async databaseId => {
      const { knex, shutdown } = await initEmptyDatabase(databases, databaseId);

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

      await shutdown();
    },
  );

  it.each(databases.eachSupportedId())(
    'respects filters in options, %p',
    async databaseId => {
      const { knex, shutdown } = await initEmptyDatabase(databases, databaseId);

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

      await shutdown();
    },
  );

  it.each(databases.eachSupportedId())(
    'respects filters that apply permissions, %p',
    async databaseId => {
      const { knex, shutdown } = await initEmptyDatabase(databases, databaseId);

      await setEntity(knex, 'foo', 1);
      await setEntity(knex, 'bar', 2);
      await knex('locations').insert({
        id: 'b07a8526-0025-47e9-bf3b-f47ac94692c2',
        type: 'url',
        target: 'https://backstage.io',
      });

      await waitFor(async () => {
        await expect(
          readHistoryEvents(
            knex,
            {
              order: 'asc',
              limit: 2,
            },
            { key: 'data', values: ['1'] },
          ),
        ).resolves.toEqual([
          {
            eventId: '1',
            eventType: 'entity_created',
            eventAt: expect.any(Date),
            entityRef: 'k:ns/foo',
            entityId: 'id-foo',
            entityJson: '{"data":1}',
            locationId: undefined,
            locationRef: undefined,
          },
          // The location event does not have an entity ID and thus does not get filtered out
          {
            eventId: '3',
            eventType: 'location_created',
            eventAt: expect.any(Date),
            entityRef: undefined,
            entityId: undefined,
            entityJson: undefined,
            locationId: 'b07a8526-0025-47e9-bf3b-f47ac94692c2',
            locationRef: 'url:https://backstage.io',
          },
        ]);
      });

      await waitFor(async () => {
        await expect(
          readHistoryEvents(
            knex,
            {
              order: 'asc',
              limit: 2,
            },
            { anyOf: [{ allOf: [{ key: 'data', values: ['2'] }] }] },
          ),
        ).resolves.toEqual([
          {
            eventId: '2',
            eventType: 'entity_created',
            eventAt: expect.any(Date),
            entityRef: 'k:ns/bar',
            entityId: 'id-bar',
            entityJson: '{"data":2}',
          },
          {
            eventId: '3',
            eventType: 'location_created',
            eventAt: expect.any(Date),
            entityRef: undefined,
            entityId: undefined,
            entityJson: undefined,
            locationId: 'b07a8526-0025-47e9-bf3b-f47ac94692c2',
            locationRef: 'url:https://backstage.io',
          },
        ]);
      });

      await shutdown();
    },
  );
});

/*
 * Copyright 2023 The Backstage Authors
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

import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { Entity } from '@backstage/catalog-model';
import { Knex } from 'knex';
import { applyDatabaseMigrations } from '../../migrations';
import { transaction } from './util';
import { writeDelivery, internals } from './writeDelivery';

jest.setTimeout(60_000);

describe('writeDelivery', () => {
  const databases = TestDatabases.create({
    ids: ['MYSQL_8', 'POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function createDatabase(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    return knex;
  }

  async function deliveries(knex: Knex) {
    return await knex('deliveries')
      .orderBy('id')
      .then(rows =>
        rows.map(row => ({
          ...row,
          id: String(row.id),
        })),
      );
  }

  async function states(knex: Knex) {
    return await knex('provider_state')
      .orderBy('id')
      .then(rows =>
        rows.map(row => ({
          ...row,
          id: String(row.id),
          deleted: Boolean(row.deleted),
          latest_delivery_id: String(row.latest_delivery_id),
        })),
      );
  }

  describe('internals.createDelivery', () => {
    it.each(databases.eachSupportedId())(
      'does the right thing, %p',
      async databaseId => {
        const knex = await createDatabase(databaseId);

        const { deliveryId } = await transaction(knex, tx =>
          internals.createDelivery({ tx, sourceKey: 'a', action: 'replace' }),
        );

        // Must be specifically a string
        expect(deliveryId).toBe('1');
      },
    );
  });

  it.each(databases.eachSupportedId())(
    'properly persists full mutations, %p',
    async databaseId => {
      const knex = await createDatabase(databaseId);

      const entity1: Entity = {
        apiVersion: 'a',
        kind: 'k',
        metadata: {
          name: 'n',
          namespace: 'ns',
        },
        spec: {},
      };

      // Persist a new addition
      const result1 = await transaction(knex, tx =>
        writeDelivery({
          tx,
          sourceKey: 'a',
          delivery: {
            type: 'full',
            entities: [{ entity: entity1, locationKey: 'l' }],
          },
        }),
      );
      expect(result1).toEqual({ deliveryId: expect.any(String) });
      await expect(deliveries(knex)).resolves.toEqual([
        {
          id: result1.deliveryId,
          source_key: 'a',
          action: 'replace',
          ended_at: expect.anything(),
          started_at: expect.anything(),
        },
      ]);
      await expect(states(knex)).resolves.toEqual([
        {
          id: expect.any(String),
          source_key: 'a',
          entity_ref: 'k:ns/n',
          location_key: 'l',
          deleted: false,
          latest_delivery_id: result1.deliveryId,
          unprocessed_entity: JSON.stringify(entity1),
          unprocessed_entity_hash: expect.any(String),
        },
      ]);

      // Perform the exact same operation, which should leave the data intact
      // but still make a new delivery and update the state reference to it
      const result2 = await transaction(knex, tx =>
        writeDelivery({
          tx,
          sourceKey: 'a',
          delivery: {
            type: 'full',
            entities: [{ entity: entity1, locationKey: 'l' }],
          },
        }),
      );
      expect(result2).toEqual({ deliveryId: expect.any(String) });
      await expect(deliveries(knex)).resolves.toEqual([
        {
          id: result1.deliveryId,
          source_key: 'a',
          action: 'replace',
          ended_at: expect.anything(),
          started_at: expect.anything(),
        },
        {
          id: result2.deliveryId,
          source_key: 'a',
          action: 'replace',
          ended_at: expect.anything(),
          started_at: expect.anything(),
        },
      ]);
      await expect(states(knex)).resolves.toEqual([
        {
          id: expect.any(String),
          source_key: 'a',
          entity_ref: 'k:ns/n',
          location_key: 'l',
          deleted: false,
          latest_delivery_id: result2.deliveryId,
          unprocessed_entity: JSON.stringify(entity1),
          unprocessed_entity_hash: expect.any(String),
        },
      ]);

      await knex.destroy();
    },
  );
});

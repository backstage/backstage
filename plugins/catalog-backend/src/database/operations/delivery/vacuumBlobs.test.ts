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
import { applyDatabaseMigrations } from '../../migrations';
import { transaction } from './util';
import { vacuumBlobs } from './vacuumBlobs';

jest.setTimeout(60_000);

describe('vacuumBlobs', () => {
  const databases = TestDatabases.create({
    ids: ['MYSQL_8', 'POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function createDatabase(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    return knex;
  }

  it.each(databases.eachSupportedId())(
    'only deletes blobs that are old and not used, %p',
    async databaseId => {
      const knex = await createDatabase(databaseId);

      await knex('blobs').insert([
        { etag: 'a', touched_at: knex.fn.now(), data: 'a' },
        { etag: 'b', touched_at: knex.fn.now(), data: 'b' },
      ]);
      await knex
        .insert({
          provider_name: 'p',
          action: 'upsert',
          started_at: knex.fn.now(),
          ended_at: knex.fn.now(),
        })
        .into('deliveries');
      const deliveryId = await knex
        .from('deliveries')
        .max('id', { as: 'id' })
        .first()
        .then(r => r.id);
      await knex
        .insert({
          delivery_id: deliveryId,
          value: 'v',
          blob_etag: 'a',
        })
        .into('delivery_entries');

      const result1 = await transaction(knex, tx =>
        vacuumBlobs({ tx, olderThan: { seconds: 1 } }),
      );
      const rows1 = await knex('blobs').orderBy('data');

      // ensure that clocks advance a bit
      await new Promise(resolve => setTimeout(resolve, 1100));

      const result2 = await transaction(knex, tx =>
        vacuumBlobs({ tx, olderThan: { seconds: 1 } }),
      );
      const rows2 = await knex('blobs').orderBy('data');

      expect(result1).toEqual(0);
      expect(result2).toEqual(1);

      expect(rows1).toEqual([
        { etag: 'a', touched_at: expect.anything(), data: 'a' },
        { etag: 'b', touched_at: expect.anything(), data: 'b' },
      ]);
      expect(rows2).toEqual([
        { etag: 'a', touched_at: expect.anything(), data: 'a' },
      ]);

      await knex.destroy();
    },
  );
});

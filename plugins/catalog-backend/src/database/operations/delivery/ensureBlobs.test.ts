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
import { ensureBlobs, internals } from './ensureBlobs';
import { transaction } from './util';

jest.setTimeout(60_000);

describe('ensureBlobs', () => {
  const databases = TestDatabases.create({
    ids: ['MYSQL_8', 'POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function createDatabase(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    return knex;
  }

  it.each(databases.eachSupportedId())(
    'inserts and upserts, %p',
    async databaseId => {
      const knex = await createDatabase(databaseId);

      const blobA = 'a';
      const blobB = 'b';
      const blobC = 'c'.repeat(100000);
      const etagA = internals.computeEtag(blobA);
      const etagB = internals.computeEtag(blobB);
      const etagC = internals.computeEtag(blobC);

      const result1 = await transaction(knex, tx =>
        ensureBlobs({ tx, blobs: [blobA, blobB] }),
      );
      const rows1 = await knex('blobs').orderBy('data');

      // ensure that clocks advance a bit so that we can test that touched_at changed
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result2 = await transaction(knex, tx =>
        ensureBlobs({ tx, blobs: [blobC, blobA] }),
      );
      const rows2 = await knex('blobs').orderBy('data');

      expect(result1.etags).toEqual([etagA, etagB]);
      expect(result2.etags).toEqual([etagC, etagA]);

      expect(rows1).toEqual([
        { etag: etagA, touched_at: expect.anything(), data: blobA },
        { etag: etagB, touched_at: expect.anything(), data: blobB },
      ]);
      expect(rows2).toEqual([
        { etag: etagA, touched_at: expect.anything(), data: blobA },
        { etag: etagB, touched_at: expect.anything(), data: blobB },
        { etag: etagC, touched_at: expect.anything(), data: blobC },
      ]);
      expect(rows1[0].touched_at).not.toEqual(rows2[0].touched_at);
      expect(rows1[1].touched_at).toEqual(rows2[1].touched_at);

      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    'handles large batches, %p',
    async databaseId => {
      const knex = await createDatabase(databaseId);

      const blobCount = 10_000;
      const blobs = Array.from({ length: blobCount }, (_, i) => `blob ${i}`);

      const result = await transaction(knex, tx => ensureBlobs({ tx, blobs }));
      const rows = await knex('blobs').orderBy('data');

      expect(result.etags[blobCount / 2]).toEqual(
        internals.computeEtag(blobs[blobCount / 2]),
      );
      expect(rows.length).toEqual(blobCount);

      await knex.destroy();
    },
  );
});

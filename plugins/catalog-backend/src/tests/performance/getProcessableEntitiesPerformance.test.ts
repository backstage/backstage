/*
 * Copyright 2024 The Backstage Authors
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

import { TestDatabases, mockServices } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import { DefaultProcessingDatabase } from '../../database/DefaultProcessingDatabase';
import { applyDatabaseMigrations } from '../../database/migrations';
import { describePerformanceTest, performanceTraceEnabled } from './lib/env';

// #region Helpers

jest.setTimeout(600_000);

const databases = TestDatabases.create({
  ids: [/* 'MYSQL_8', */ 'POSTGRES_17', /* 'POSTGRES_13',*/ 'SQLITE_3'],
  disableDocker: false,
});

const traceLog: typeof console.log = performanceTraceEnabled
  ? console.log
  : () => {};

async function setupDatabase(knex: Knex): Promise<void> {
  await applyDatabaseMigrations(knex);

  traceLog(`Creating test dataset`);

  const now = knex.fn.now();
  const largeEntity = `"${'x'.repeat(3 * 1024)}"`;

  for (let i = 0; i < 100; ++i) {
    await knex.batchInsert(
      'refresh_state',
      new Array(100).fill(null).map((_, j) => ({
        entity_id: `id-${i}-${j}`,
        entity_ref: `entity-${i}-${j}`,
        unprocessed_entity: largeEntity,
        processed_entity: largeEntity,
        errors: '{}',
        next_update_at: now,
        last_discovery_at: now,
      })),
    );
  }
}

// #endregion
// #region Tests

describePerformanceTest('getProcessableEntities', () => {
  let knex: Knex;

  describe.each(databases.eachSupportedId())('%p', databaseId => {
    beforeAll(async () => {
      knex = await databases.init(databaseId);
      await setupDatabase(knex);
    });

    afterAll(async () => {
      await knex.destroy();
    });

    it.each([2, 5, 10])(
      'reads as fast as possible, batch size %p',
      async processBatchSize => {
        const sut = new DefaultProcessingDatabase({
          database: knex,
          logger: mockServices.logger.mock(),
          refreshInterval: () => 0,
        });

        const start = Date.now();
        let total = 0;
        while (total < 10000) {
          const result = await sut.getProcessableEntities(knex, {
            processBatchSize,
          });
          total += result.items.length;
        }

        const perSecond = Math.round(total / ((Date.now() - start) / 1000));
        traceLog(
          `${databaseId} processed ${perSecond} entities per second at a batch size of ${processBatchSize}`,
        );

        expect(true).toBe(true);
      },
    );
  });
});

// #endregion

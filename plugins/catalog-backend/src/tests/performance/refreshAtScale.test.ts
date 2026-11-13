/*
 * Copyright 2026 The Backstage Authors
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

import { mockServices } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import { DefaultCatalogDatabase } from '../../database/DefaultCatalogDatabase';
import { DefaultProviderDatabase } from '../../database/DefaultProviderDatabase';
import { describePerformanceTest } from './lib/env';
import {
  cloneDataset,
  getPerformanceDatabaseIds,
  getPerformanceDataset,
} from './lib/dataset';
import { measure } from './lib/measure';

jest.setTimeout(600_000);

const REFRESH_COUNT = 200;
const KEY_COUNT = 20;
const MAX_KEYED_ENTITIES = 50_000;

async function dueCount(knex: Knex): Promise<number> {
  const [row] = await knex('refresh_state')
    .where('next_update_at', '<=', knex.fn.now())
    .count({ count: '*' });
  return Number(row.count);
}

describePerformanceTest('refresh at scale', () => {
  describe.each(getPerformanceDatabaseIds())('%s', databaseId => {
    let knex: Knex;
    let size: number;

    beforeAll(async () => {
      const dataset = await getPerformanceDataset(databaseId);
      size = dataset.size;
      knex = await cloneDataset(dataset.knex);
    });

    afterAll(async () => {
      await knex?.destroy();
    });

    it('schedules individual entities for refresh', async () => {
      const logger = mockServices.logger.mock();
      const db = new DefaultCatalogDatabase({ database: knex, logger });
      // Take from the end of the id range, which the keyed test leaves alone
      const refs = (
        await knex('refresh_state')
          .orderBy('entity_id', 'desc')
          .limit(REFRESH_COUNT)
          .select('entity_ref')
      ).map(r => r.entity_ref as string);
      expect(await dueCount(knex)).toBe(0);

      await measure(expect.getState().currentTestName!, async () => {
        for (const entityRef of refs) {
          await db.transaction(tx => db.refresh(tx, { entityRef }));
        }
      });

      expect(await dueCount(knex)).toBe(REFRESH_COUNT);
      const refreshed = await knex('refresh_state')
        .whereIn('entity_ref', refs)
        .where('next_update_at', '<=', knex.fn.now())
        .count({ count: '*' });
      expect(Number(refreshed[0].count)).toBe(REFRESH_COUNT);
    });

    it('schedules entities for refresh by refresh key', async () => {
      const keyed = Math.min(MAX_KEYED_ENTITIES, Math.floor(size / 4));
      await knex.raw(
        `INSERT INTO refresh_keys (entity_id, key)
         SELECT entity_id, 'perf-key-' || (row_number() OVER (ORDER BY entity_id) % ?)
         FROM (SELECT entity_id FROM refresh_state ORDER BY entity_id LIMIT ?) AS e`,
        [KEY_COUNT, keyed],
      );
      await knex.raw('ANALYZE refresh_keys');
      const [{ expected }] = (
        await knex.raw(
          `SELECT count(DISTINCT entity_id)::int AS expected FROM refresh_keys WHERE key IN ('perf-key-0', 'perf-key-1')`,
        )
      ).rows;
      expect(expected).toBe((keyed / KEY_COUNT) * 2);

      const db = new DefaultProviderDatabase({
        database: knex,
        logger: mockServices.logger.mock(),
      });
      const before = await dueCount(knex);

      await measure(expect.getState().currentTestName!, () =>
        db.transaction(tx =>
          db.refreshByRefreshKeys(tx, { keys: ['perf-key-0', 'perf-key-1'] }),
        ),
      );

      expect(await dueCount(knex)).toBe(before + expected);
    });
  });
});

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

import { Knex } from 'knex';
import { deleteOrphanedEntities } from '../../database/operations/util/deleteOrphanedEntities';
import { deleteWithEagerPruningOfChildren } from '../../database/operations/provider/deleteWithEagerPruningOfChildren';
import { describePerformanceTest } from './lib/env';
import {
  cloneDataset,
  getPerformanceDatabaseIds,
  getPerformanceDataset,
} from './lib/dataset';
import { captureQueries, explain, seqScansOn } from './lib/explain';
import { measure } from './lib/measure';

jest.setTimeout(600_000);

const PROVIDER_KEY = 'perf-provider';
const ORPHAN_COUNT = 1_000;
const LOCATIONS_TO_DELETE = 3;

async function count(knex: Knex, table: string): Promise<number> {
  const [row] = await knex(table).count({ count: '*' });
  return Number(row.count);
}

/**
 * Turns existing components into orphans by removing the references that
 * point at them.
 */
async function createOrphans(knex: Knex, offset: number): Promise<string[]> {
  const rows = await knex('refresh_state')
    .where('entity_ref', 'like', 'component:default/svc-%')
    .orderBy('entity_ref')
    .offset(offset)
    .limit(ORPHAN_COUNT)
    .select('entity_ref');
  const refs = rows.map(r => r.entity_ref as string);
  expect(refs).toHaveLength(ORPHAN_COUNT);
  await knex('refresh_state_references')
    .whereIn('target_entity_ref', refs)
    .delete();
  return refs;
}

/** Runs `fn` in a transaction that is rolled back, capturing its queries. */
async function captureAndRollback(
  knex: Knex,
  fn: (trx: Knex.Transaction) => Promise<unknown>,
) {
  return captureQueries(knex, () =>
    knex.transaction(
      async trx => {
        await fn(trx);
        await trx.rollback();
      },
      { doNotRejectOnRollback: true },
    ),
  );
}

describePerformanceTest('orphan cleanup', () => {
  describe.each(getPerformanceDatabaseIds())('%s', databaseId => {
    let knex: Knex;

    beforeAll(async () => {
      const dataset = await getPerformanceDataset(databaseId);
      knex = await cloneDataset(dataset.knex);
    });

    afterAll(async () => {
      await knex?.destroy();
    });

    it('finds orphans without scanning the references table', async () => {
      await createOrphans(knex, 0);

      const { queries } = await captureAndRollback(knex, trx =>
        deleteOrphanedEntities({ knex: trx }),
      );
      const candidates = queries.find(q => q.sql.includes('orphan_refs'));
      expect(candidates).toBeDefined();

      const { plan } = await explain(knex, candidates!);
      expect(seqScansOn(plan, 'refresh_state_references')).toEqual([]);
    });

    it('deletes orphaned entities', async () => {
      const before = await count(knex, 'refresh_state');
      const stitchesBefore = await count(knex, 'stitch_queue');

      const deleted = await measure(expect.getState().currentTestName!, () =>
        deleteOrphanedEntities({ knex }),
      );

      expect(deleted).toBe(ORPHAN_COUNT);
      expect(await count(knex, 'refresh_state')).toBe(before - ORPHAN_COUNT);
      expect(await count(knex, 'final_entities')).toBe(before - ORPHAN_COUNT);
      // The entities related to the orphans must be restitched
      expect(await count(knex, 'stitch_queue')).toBeGreaterThan(stitchesBefore);
    });

    it('finds descendants of a deleted location without scanning the references table', async () => {
      const locations = await knex('refresh_state_references')
        .where('source_key', PROVIDER_KEY)
        .orderBy('target_entity_ref')
        .limit(LOCATIONS_TO_DELETE)
        .select('target_entity_ref');
      const refs = locations.map(l => l.target_entity_ref as string);

      const { queries } = await captureAndRollback(knex, trx =>
        deleteWithEagerPruningOfChildren({
          knex: trx,
          entityRefs: refs,
          sourceKey: PROVIDER_KEY,
        }),
      );
      const descendants = queries.find(q => q.sql.includes('descendants'));
      expect(descendants).toBeDefined();

      const { plan } = await explain(knex, descendants!);
      expect(seqScansOn(plan, 'refresh_state_references')).toEqual([]);
    });

    it('eagerly deletes the children of a deleted location', async () => {
      const locations = await knex('refresh_state_references')
        .where('source_key', PROVIDER_KEY)
        .orderBy('target_entity_ref')
        .limit(LOCATIONS_TO_DELETE)
        .select('target_entity_ref');
      const refs = locations.map(l => l.target_entity_ref as string);
      // Every child has the location as its only parent
      const [{ children }] = await knex('refresh_state_references')
        .whereIn('source_entity_ref', refs)
        .count({ children: '*' });
      const expected = refs.length + Number(children);
      const before = await count(knex, 'refresh_state');

      const removed = await measure(expect.getState().currentTestName!, () =>
        deleteWithEagerPruningOfChildren({
          knex,
          entityRefs: refs,
          sourceKey: PROVIDER_KEY,
        }),
      );

      expect(removed).toBe(expected);
      expect(await count(knex, 'refresh_state')).toBe(before - expected);
      expect(
        await knex('refresh_state_references')
          .whereIn('source_entity_ref', refs)
          .orWhereIn('target_entity_ref', refs),
      ).toEqual([]);
    });
  });
});

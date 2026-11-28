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
import { getDeferredStitchableEntities } from '../../database/operations/stitcher/getDeferredStitchableEntities';
import { markDeferredStitchCompleted } from '../../database/operations/stitcher/markDeferredStitchCompleted';
import { markForStitching } from '../../database/operations/stitcher/markForStitching';
import { describePerformanceTest } from './lib/env';
import {
  cloneDataset,
  getPerformanceDatabaseIds,
  getPerformanceDataset,
} from './lib/dataset';
import { measure } from './lib/measure';

jest.setTimeout(600_000);

const MAX_QUEUED = 50_000;
const CLAIM_BATCH_SIZE = 1_000;
const COMPLETED_COUNT = 2_000;

async function queueSize(knex: Knex): Promise<number> {
  const [row] = await knex('stitch_queue').count({ count: '*' });
  return Number(row.count);
}

describePerformanceTest('stitch queue', () => {
  describe.each(getPerformanceDatabaseIds())('%s', databaseId => {
    let knex: Knex;
    let refs: string[];

    beforeAll(async () => {
      const dataset = await getPerformanceDataset(databaseId);
      knex = await cloneDataset(dataset.knex);
      refs = (
        await knex('refresh_state')
          .orderBy('entity_ref')
          .limit(Math.min(MAX_QUEUED, Math.floor(dataset.size / 2)))
          .select('entity_ref')
      ).map(r => r.entity_ref);
    });

    afterAll(async () => {
      await knex?.destroy();
    });

    it('queues many entities, and requeues them', async () => {
      expect(await queueSize(knex)).toBe(0);

      await measure(`${expect.getState().currentTestName!} (insert)`, () =>
        markForStitching({ knex, entityRefs: refs }),
      );
      expect(await queueSize(knex)).toBe(refs.length);
      const [first] = await knex('stitch_queue').where('entity_ref', refs[0]);

      await measure(`${expect.getState().currentTestName!} (conflict)`, () =>
        markForStitching({ knex, entityRefs: refs }),
      );
      expect(await queueSize(knex)).toBe(refs.length);
      const [second] = await knex('stitch_queue').where('entity_ref', refs[0]);
      expect(second.stitch_ticket).not.toBe(first.stitch_ticket);
    });

    it('claims the whole queue in batches, then completes some of it', async () => {
      const claimed = new Map<
        string,
        Awaited<ReturnType<typeof getDeferredStitchableEntities>>[number]
      >();
      await measure(
        `${expect.getState().currentTestName!} (claim)`,
        async () => {
          for (;;) {
            const batch = await getDeferredStitchableEntities({
              knex,
              batchSize: CLAIM_BATCH_SIZE,
              stitchTimeout: { seconds: 60 },
            });
            if (!batch.length) {
              return;
            }
            for (const item of batch) {
              expect(claimed.has(item.entityRef)).toBe(false);
              claimed.set(item.entityRef, item);
            }
          }
        },
      );
      // Every entry is claimed exactly once, and nothing is left to claim
      expect(claimed.size).toBe(refs.length);
      expect(new Set(claimed.keys())).toEqual(new Set(refs));

      const completed = [...claimed.values()].slice(0, COMPLETED_COUNT);
      await measure(
        `${expect.getState().currentTestName!} (complete)`,
        async () => {
          for (const item of completed) {
            await markDeferredStitchCompleted({
              knex,
              entityRef: item.entityRef,
              stitchTicket: item.stitchTicket,
              stitchLeaseExpiresAt: item.stitchLeaseExpiresAt,
            });
          }
        },
      );

      expect(await queueSize(knex)).toBe(refs.length - COMPLETED_COUNT);
      expect(
        await knex('stitch_queue').whereIn(
          'entity_ref',
          completed.map(c => c.entityRef),
        ),
      ).toEqual([]);
    });
  });
});

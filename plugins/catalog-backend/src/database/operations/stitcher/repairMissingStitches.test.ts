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

import { mockServices, TestDatabases } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import { applyDatabaseMigrations } from '../../migrations';
import {
  DbFinalEntitiesRow,
  DbRefreshStateRow,
  DbStitchQueueRow,
} from '../../tables';
import { createMissingStitchRepair } from './repairMissingStitches';

jest.setTimeout(60_000);

const databases = TestDatabases.create();
const ref = (name: string) => `component:default/${name}`;

function entity(name: string, uid?: string) {
  return JSON.stringify({
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name, namespace: 'default', uid },
    spec: { type: 'service', lifecycle: 'production', owner: 'team-a' },
  });
}

async function insertFinal(
  knex: Knex,
  name: string,
  slotId: string,
  winner: string | null | undefined = undefined,
  live = true,
) {
  await knex<DbFinalEntitiesRow>('final_entities').insert({
    entity_id: slotId,
    entity_ref: ref(name),
    final_entity: live ? entity(name, winner ?? slotId) : null,
    hash: live ? 'published-hash' : '',
    winner_candidate_id: winner,
  });
}

async function insertCandidate(knex: Knex, name: string, id: string) {
  await knex<DbRefreshStateRow>('refresh_state').insert({
    entity_id: id,
    entity_ref: ref(name),
    unprocessed_entity: entity(name),
    processed_entity: entity(name),
    result_hash: 'processed-hash',
    errors: '[]',
    next_update_at: knex.fn.now(),
    last_discovery_at: knex.fn.now(),
  });
}

function readQueue(knex: Knex) {
  return knex<DbStitchQueueRow>('stitch_queue').orderBy('entity_ref');
}

describe.each(databases.eachSupportedId())(
  'createMissingStitchRepair, %p',
  databaseId => {
    let knex: Knex;

    beforeEach(async () => {
      knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);
    });

    it('queues rows whose winner is gone, without disturbing healthy rows or existing requests', async () => {
      // Deleted by an older stitcher: no candidate at all.
      await insertFinal(knex, 'deleted', 'deleted-slot');
      // A revived slot whose published winner was deleted and re-created.
      await insertFinal(knex, 'stale', 'stale-slot', 'stale-old');
      await insertCandidate(knex, 'stale', 'stale-current');
      // Healthy rows: a revived slot, an explicit and a legacy (null) winner.
      await insertFinal(knex, 'reused', 'reused-slot', 'reused-current');
      await insertCandidate(knex, 'reused', 'reused-current');
      await insertFinal(knex, 'explicit', 'explicit-id', 'explicit-id');
      await insertCandidate(knex, 'explicit', 'explicit-id');
      await insertFinal(knex, 'legacy', 'legacy-id');
      await insertCandidate(knex, 'legacy', 'legacy-id');
      await insertFinal(knex, 'tombstone', 'tombstone-slot', null, false);
      // A pending request keeps its ticket and lease.
      await insertFinal(knex, 'queued', 'queued-slot');
      await knex<DbStitchQueueRow>('stitch_queue').insert({
        entity_ref: ref('queued'),
        stitch_ticket: 'existing-ticket',
        next_stitch_at: '2099-01-01 00:00:00',
        failure_count: 3,
      });
      const [existingRequest] = await readQueue(knex);
      const finalBefore = await knex<DbFinalEntitiesRow>(
        'final_entities',
      ).orderBy('entity_ref');
      const logger = mockServices.logger.mock();
      const repair = createMissingStitchRepair({ knex, logger, batchSize: 2 });

      await repair(new AbortController().signal);

      await expect(readQueue(knex)).resolves.toEqual([
        expect.objectContaining({
          entity_ref: ref('deleted'),
          stitch_ticket: expect.any(String),
          failure_count: 0,
        }),
        existingRequest,
        expect.objectContaining({
          entity_ref: ref('stale'),
          stitch_ticket: expect.any(String),
          failure_count: 0,
        }),
      ]);
      await expect(
        knex<DbFinalEntitiesRow>('final_entities').orderBy('entity_ref'),
      ).resolves.toEqual(finalBefore);
      const findings = logger.warn.mock.calls.map(
        ([, meta]) => (meta as { entityRefs: string }).entityRefs,
      );
      expect(findings.join(', ').split(', ').sort()).toEqual([
        ref('deleted'),
        ref('stale'),
      ]);

      // Nothing new to find on the next pass.
      logger.warn.mockClear();
      await repair(new AbortController().signal);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('bounds each run, resumes from its cursor and wraps around after a full pass', async () => {
      const names = ['a', 'b', 'c', 'd', 'e'];
      for (const name of names) {
        await insertFinal(knex, name, name);
      }
      const repair = createMissingStitchRepair({
        knex,
        logger: mockServices.logger.mock(),
        batchSize: 2,
        maxBatchesPerRun: 1,
      });
      const queued = async () =>
        (await readQueue(knex)).map(row => row.entity_ref);

      await repair(new AbortController().signal);
      expect(await queued()).toEqual([ref('a'), ref('b')]);
      await repair(new AbortController().signal);
      expect(await queued()).toEqual(['a', 'b', 'c', 'd'].map(ref));
      await repair(new AbortController().signal);
      expect(await queued()).toEqual(names.map(ref));

      // The last batch was short, so the next run starts over.
      await knex('stitch_queue').delete();
      await repair(new AbortController().signal);
      expect(await queued()).toEqual([ref('a'), ref('b')]);
    });

    it('does nothing when already aborted', async () => {
      await insertFinal(knex, 'deleted', 'deleted-slot');
      const repair = createMissingStitchRepair({
        knex,
        logger: mockServices.logger.mock(),
      });
      const controller = new AbortController();
      controller.abort();

      await repair(controller.signal);

      await expect(readQueue(knex)).resolves.toEqual([]);
    });
  },
);

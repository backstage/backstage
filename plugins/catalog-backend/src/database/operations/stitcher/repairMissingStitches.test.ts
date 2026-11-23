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
  publishedUid: string | null = slotId,
) {
  await knex<DbFinalEntitiesRow>('final_entities').insert({
    entity_id: slotId,
    entity_ref: ref(name),
    final_entity: publishedUid === null ? null : entity(name, publishedUid),
    hash: 'published-hash',
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

    it('queues missing work without disturbing healthy slots or existing requests', async () => {
      await insertFinal(knex, 'deleted', 'deleted-slot');
      await insertFinal(knex, 'stale', 'stale-slot');
      await insertCandidate(knex, 'stale', 'stale-current');
      await insertFinal(knex, 'reused', 'reused-slot', 'reused-current');
      await insertCandidate(knex, 'reused', 'reused-current');
      await insertFinal(knex, 'tombstone', 'tombstone-slot', null);
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
      const repair = createMissingStitchRepair({
        knex,
        logger: mockServices.logger.mock(),
        pageSize: 1,
      });

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
    });

    it('repairs across pages without exceeding the repair cap', async () => {
      const names = ['one', 'two', 'three', 'four', 'five'];
      for (const name of names) {
        await insertFinal(knex, name, name);
      }
      const logger = mockServices.logger.mock();
      const repair = createMissingStitchRepair({
        knex,
        logger,
        pageSize: 2,
        maxRepairs: 3,
      });

      await repair(new AbortController().signal);
      await repair(new AbortController().signal);

      const queuedRefs = (await readQueue(knex)).map(row => row.entity_ref);
      expect(queuedRefs).toHaveLength(3);
      expect(names.map(ref)).toEqual(expect.arrayContaining(queuedRefs));
      expect(logger.warn).toHaveBeenCalledTimes(1);
      expect(logger.warn).toHaveBeenCalledWith(expect.any(String), {
        count: 3,
        repairLimitReached: true,
      });
    });

    it('stops between pages and reports repairs already enqueued on abort', async () => {
      await insertFinal(knex, 'first', 'a');
      await insertFinal(knex, 'second', 'b');
      const logger = mockServices.logger.mock();
      const controller = new AbortController();
      const repair = createMissingStitchRepair({ knex, logger, pageSize: 1 });
      const onResponse = (_result: unknown, query: { sql: string }) => {
        if (/^insert.*stitch_queue/i.test(query.sql)) controller.abort();
      };
      knex.on('query-response', onResponse);
      try {
        await repair(controller.signal);
      } finally {
        knex.removeListener('query-response', onResponse);
      }

      expect(controller.signal.aborted).toBe(true);
      await expect(readQueue(knex)).resolves.toEqual([
        expect.objectContaining({ entity_ref: ref('first') }),
      ]);
      expect(logger.warn).toHaveBeenCalledWith(expect.any(String), {
        count: 1,
        repairLimitReached: false,
      });
    });

    it('does not queue repairs when already aborted', async () => {
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

    it('expires one hour after creation, even before its first invocation', async () => {
      await insertFinal(knex, 'deleted', 'deleted-slot');
      const options = { knex, logger: mockServices.logger.mock() };
      const startedAt = Date.now();
      const clock = jest.spyOn(Date, 'now').mockReturnValue(startedAt);
      try {
        const expired = createMissingStitchRepair(options);
        clock.mockReturnValue(startedAt + 60 * 60 * 1000 + 1);

        await expired(new AbortController().signal);
        await expect(readQueue(knex)).resolves.toEqual([]);

        const fresh = createMissingStitchRepair(options);
        await fresh(new AbortController().signal);
        await expect(readQueue(knex)).resolves.toEqual([
          expect.objectContaining({ entity_ref: ref('deleted') }),
        ]);
      } finally {
        clock.mockRestore();
      }
    });
  },
);

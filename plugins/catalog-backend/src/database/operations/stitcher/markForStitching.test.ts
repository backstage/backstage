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

import { TestDatabases } from '@backstage/backend-test-utils';
import { applyDatabaseMigrations } from '../../migrations';
import { markForStitching } from './markForStitching';
import { DbRefreshStateRow, DbStitchQueueRow } from '../../tables';

jest.setTimeout(60_000);

const databases = TestDatabases.create();

it.each(databases.eachSupportedId())(
  'marks the right rows %p',
  async databaseId => {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);

    await knex<DbRefreshStateRow>('refresh_state').insert([
      {
        entity_id: '1',
        entity_ref: 'k:ns/one',
        unprocessed_entity: '{}',
        processed_entity: '{}',
        errors: '[]',
        next_update_at: knex.fn.now(),
        last_discovery_at: knex.fn.now(),
      },
      {
        entity_id: '2',
        entity_ref: 'k:ns/two',
        unprocessed_entity: '{}',
        processed_entity: '{}',
        errors: '[]',
        next_update_at: knex.fn.now(),
        last_discovery_at: knex.fn.now(),
      },
      {
        entity_id: '3',
        entity_ref: 'k:ns/three',
        unprocessed_entity: '{}',
        processed_entity: '{}',
        errors: '[]',
        next_update_at: knex.fn.now(),
        last_discovery_at: knex.fn.now(),
      },
      {
        entity_id: '4',
        entity_ref: 'k:ns/four',
        unprocessed_entity: '{}',
        processed_entity: '{}',
        errors: '[]',
        next_update_at: knex.fn.now(),
        last_discovery_at: knex.fn.now(),
      },
    ]);
    // Entity 4 has an existing stitch_queue row with old stitch data
    await knex<DbStitchQueueRow>('stitch_queue').insert([
      {
        entity_ref: 'k:ns/four',
        stitch_ticket: 'old',
        next_stitch_at: '1971-01-01T00:00:00.000',
      },
    ]);

    async function result() {
      return knex<DbStitchQueueRow>('stitch_queue')
        .select('entity_ref', 'next_stitch_at', 'stitch_ticket')
        .orderBy('entity_ref', 'asc');
    }

    // Initially only entity 4 has a stitch_queue row
    const original = await result();
    expect(original).toEqual([
      {
        entity_ref: 'k:ns/four',
        next_stitch_at: expect.anything(),
        stitch_ticket: 'old',
      },
    ]);

    // Calling with empty set should not create any new rows
    await markForStitching({
      knex,
      entityRefs: new Set(),
    });
    await expect(result()).resolves.toEqual([
      {
        entity_ref: 'k:ns/four',
        next_stitch_at: expect.anything(),
        stitch_ticket: 'old',
      },
    ]);

    // Mark entity 1 - should create a new stitch_queue row
    await markForStitching({
      knex,
      entityRefs: new Set(['k:ns/one']),
    });
    await expect(result()).resolves.toEqual([
      {
        entity_ref: 'k:ns/four',
        next_stitch_at: expect.anything(),
        stitch_ticket: 'old',
      },
      {
        entity_ref: 'k:ns/one',
        next_stitch_at: expect.anything(),
        stitch_ticket: expect.anything(),
      },
    ]);

    // Mark entity 2 - should create another new stitch_queue row
    await markForStitching({
      knex,
      entityRefs: ['k:ns/two'],
    });
    await expect(result()).resolves.toEqual([
      {
        entity_ref: 'k:ns/four',
        next_stitch_at: expect.anything(),
        stitch_ticket: 'old',
      },
      {
        entity_ref: 'k:ns/one',
        next_stitch_at: expect.anything(),
        stitch_ticket: expect.anything(),
      },
      {
        entity_ref: 'k:ns/two',
        next_stitch_at: expect.anything(),
        stitch_ticket: expect.anything(),
      },
    ]);

    // Mark entities 3 and 4 by ID - entity 3 creates new row, entity 4 updates existing
    await markForStitching({
      knex,
      entityIds: ['3', '4'],
    });
    await expect(result()).resolves.toEqual([
      {
        entity_ref: 'k:ns/four',
        next_stitch_at: expect.anything(),
        stitch_ticket: expect.anything(),
      },
      {
        entity_ref: 'k:ns/one',
        next_stitch_at: expect.anything(),
        stitch_ticket: expect.anything(),
      },
      {
        entity_ref: 'k:ns/three',
        next_stitch_at: expect.anything(),
        stitch_ticket: expect.anything(),
      },
      {
        entity_ref: 'k:ns/two',
        next_stitch_at: expect.anything(),
        stitch_ticket: expect.anything(),
      },
    ]);

    // Entity 4's ticket should have been updated (was 'old', now something else)
    const final = await result();
    const entity4Final = final.find(r => r.entity_ref === 'k:ns/four');
    expect(entity4Final?.stitch_ticket).not.toEqual('old');
  },
);

it.each(databases.eachSupportedId())(
  'reproduces deadlock scenario when concurrent transactions update overlapping entity sets %p',
  async databaseId => {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);

    // Setup test data with multiple entities
    const entityRefs = [
      'k:ns/entity-a',
      'k:ns/entity-b',
      'k:ns/entity-c',
      'k:ns/entity-d',
      'k:ns/entity-e',
      'k:ns/entity-f',
    ];

    await knex<DbRefreshStateRow>('refresh_state').insert(
      entityRefs.map((ref, i) => ({
        entity_id: `${i + 1}`,
        entity_ref: ref,
        unprocessed_entity: '{}',
        processed_entity: '{}',
        errors: '[]',
        next_update_at: knex.fn.now(),
        last_discovery_at: knex.fn.now(),
      })),
    );

    // This test attempts to reproduce the deadlock by running concurrent transactions
    // that update overlapping sets of entities in different orders
    const errorResults = [];

    for (let attempt = 0; attempt < 10; attempt++) {
      // Transaction 1: Update entities A, B, C, D, E
      const transaction1 = knex.transaction(async trx => {
        await markForStitching({
          knex: trx,
          entityRefs: [
            'k:ns/entity-a',
            'k:ns/entity-b',
            'k:ns/entity-c',
            'k:ns/entity-d',
            'k:ns/entity-e',
          ],
        });

        // Add a small delay to increase chance of collision
        await new Promise(resolve => setTimeout(resolve, 10));

        await markForStitching({
          knex: trx,
          entityRefs: ['k:ns/entity-f'],
        });
      });

      // Transaction 2: Update entities F, E, D, C, B (reverse order)
      const transaction2 = knex.transaction(async trx => {
        await markForStitching({
          knex: trx,
          entityRefs: [
            'k:ns/entity-f',
            'k:ns/entity-e',
            'k:ns/entity-d',
            'k:ns/entity-c',
            'k:ns/entity-b',
          ],
        });

        // Add a small delay to increase chance of collision
        await new Promise(resolve => setTimeout(resolve, 10));

        await markForStitching({
          knex: trx,
          entityRefs: ['k:ns/entity-a'],
        });
      });

      // Run both transactions concurrently to create potential deadlock
      errorResults.push(
        Promise.allSettled([transaction1, transaction2]).then(results =>
          results
            .filter(r => r.status === 'rejected')
            .map(r => (r as PromiseRejectedResult).reason),
        ),
      );
    }

    const allResults = await Promise.all(errorResults);

    const deadlockErrors = allResults
      .flat()
      .filter(
        error =>
          error?.code === '40P01' ||
          error?.message?.includes('deadlock detected') ||
          error?.message?.includes('deadlock'),
      );
    expect(deadlockErrors).toEqual([]);

    // Verify final state - all entities should have been marked for stitching
    const finalState = await knex<DbStitchQueueRow>('stitch_queue')
      .select('entity_ref', 'next_stitch_at', 'stitch_ticket')
      .orderBy('entity_ref');

    expect(finalState.length).toBeGreaterThan(0);
    finalState.forEach(row => {
      expect(row.next_stitch_at).not.toBeNull();
      expect(row.stitch_ticket).not.toBeNull();
    });
  },
);

describe.each(databases.eachSupportedId())(
  'stitch queue overlap prevention, %p',
  databaseId => {
    it('does not overwrite next_stitch_at when a stitch is in progress', async () => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);

      // Simulate a claimed entry: next_stitch_at far in the future
      const futureTimestamp = '2099-01-01T00:00:00.000';
      await knex<DbStitchQueueRow>('stitch_queue').insert({
        entity_ref: 'k:ns/target',
        stitch_ticket: 'in-progress-ticket',
        next_stitch_at: futureTimestamp,
      });

      // A new stitch request comes in while the stitch is in progress
      await markForStitching({ knex, entityRefs: ['k:ns/target'] });

      const [row] = await knex<DbStitchQueueRow>('stitch_queue').where(
        'entity_ref',
        'k:ns/target',
      );

      // Ticket should be updated (new stitch requested)
      expect(row.stitch_ticket).not.toBe('in-progress-ticket');
      // Timestamp should NOT be yanked back to now — the in-progress
      // worker's timeout must be respected
      const nextStitch = new Date(row.next_stitch_at as string);
      expect(nextStitch.getFullYear()).toBe(2099);
    });

    it('sets next_stitch_at to now for new entries', async () => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);

      await markForStitching({ knex, entityRefs: ['k:ns/brand-new'] });

      const [row] = await knex<DbStitchQueueRow>('stitch_queue').where(
        'entity_ref',
        'k:ns/brand-new',
      );

      expect(row.stitch_ticket).toBeDefined();
      const nextStitch = new Date(row.next_stitch_at as string);
      expect(nextStitch.getTime()).toBeLessThanOrEqual(Date.now() + 5000);
    });
  },
);

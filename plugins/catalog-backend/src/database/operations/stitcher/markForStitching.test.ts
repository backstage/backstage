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
import { DbFinalEntitiesRow, DbRefreshStateRow } from '../../tables';

jest.setTimeout(60_000);

describe('markForStitching', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    'marks the right rows in deferred mode %p',
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
          next_stitch_at: null,
          next_stitch_ticket: null,
        },
        {
          entity_id: '2',
          entity_ref: 'k:ns/two',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
          next_stitch_at: null,
          next_stitch_ticket: null,
        },
        {
          entity_id: '3',
          entity_ref: 'k:ns/three',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
          next_stitch_at: null,
          next_stitch_ticket: null,
        },
        {
          entity_id: '4',
          entity_ref: 'k:ns/four',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
          next_stitch_at: '1971-01-01T00:00:00.000',
          next_stitch_ticket: 'old',
        },
      ]);

      async function result() {
        return knex<DbRefreshStateRow>('refresh_state')
          .select('entity_id', 'next_stitch_at', 'next_stitch_ticket')
          .orderBy('entity_id', 'asc');
      }

      const original = await result();

      await markForStitching({
        knex,
        strategy: {
          mode: 'deferred',
          pollingInterval: { seconds: 1 },
          stitchTimeout: { seconds: 1 },
        },
        entityRefs: new Set(),
      });
      await expect(result()).resolves.toEqual([
        { entity_id: '1', next_stitch_at: null, next_stitch_ticket: null },
        { entity_id: '2', next_stitch_at: null, next_stitch_ticket: null },
        { entity_id: '3', next_stitch_at: null, next_stitch_ticket: null },
        {
          entity_id: '4',
          next_stitch_at: expect.anything(),
          next_stitch_ticket: 'old',
        },
      ]);

      await markForStitching({
        knex,
        strategy: {
          mode: 'deferred',
          pollingInterval: { seconds: 1 },
          stitchTimeout: { seconds: 1 },
        },
        entityRefs: new Set(['k:ns/one']),
      });
      await expect(result()).resolves.toEqual([
        {
          entity_id: '1',
          next_stitch_at: expect.anything(),
          next_stitch_ticket: expect.anything(),
        },
        { entity_id: '2', next_stitch_at: null, next_stitch_ticket: null },
        { entity_id: '3', next_stitch_at: null, next_stitch_ticket: null },
        {
          entity_id: '4',
          next_stitch_at: expect.anything(),
          next_stitch_ticket: 'old',
        },
      ]);

      await markForStitching({
        knex,
        strategy: {
          mode: 'deferred',
          pollingInterval: { seconds: 1 },
          stitchTimeout: { seconds: 1 },
        },
        entityRefs: ['k:ns/two'],
      });
      await expect(result()).resolves.toEqual([
        {
          entity_id: '1',
          next_stitch_at: expect.anything(),
          next_stitch_ticket: expect.anything(),
        },
        {
          entity_id: '2',
          next_stitch_at: expect.anything(),
          next_stitch_ticket: expect.anything(),
        },
        { entity_id: '3', next_stitch_at: null, next_stitch_ticket: null },
        {
          entity_id: '4',
          next_stitch_at: expect.anything(),
          next_stitch_ticket: 'old',
        },
      ]);

      await markForStitching({
        knex,
        strategy: {
          mode: 'deferred',
          pollingInterval: { seconds: 1 },
          stitchTimeout: { seconds: 1 },
        },
        entityIds: ['3', '4'],
      });
      await expect(result()).resolves.toEqual([
        {
          entity_id: '1',
          next_stitch_at: expect.anything(),
          next_stitch_ticket: expect.anything(),
        },
        {
          entity_id: '2',
          next_stitch_at: expect.anything(),
          next_stitch_ticket: expect.anything(),
        },
        {
          entity_id: '3',
          next_stitch_at: expect.anything(),
          next_stitch_ticket: expect.anything(),
        },
        {
          entity_id: '4',
          next_stitch_at: expect.anything(),
          next_stitch_ticket: expect.anything(),
        },
      ]);

      // It overwrites timers and tickets if they existed before
      const final = await result();
      for (let i = 0; i < final.length; ++i) {
        expect(original[i].next_stitch_at).not.toEqual(final[i].next_stitch_at);
        expect(original[i].next_stitch_ticket).not.toEqual(
          final[i].next_stitch_ticket,
        );
      }
    },
  );

  it.each(databases.eachSupportedId())(
    'marks the right rows in immediate mode %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);

      await knex<DbRefreshStateRow>('refresh_state').insert([
        {
          entity_id: '1',
          entity_ref: 'k:ns/one',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          result_hash: 'old',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
        },
        {
          entity_id: '2',
          entity_ref: 'k:ns/two',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          result_hash: 'old',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
        },
        {
          entity_id: '3',
          entity_ref: 'k:ns/three',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          result_hash: 'old',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
        },
        {
          entity_id: '4',
          entity_ref: 'k:ns/four',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          result_hash: 'old',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
        },
      ]);
      await knex<DbFinalEntitiesRow>('final_entities').insert([
        {
          entity_id: '1',
          final_entity: '{}',
          entity_ref: 'k:ns/one',
          hash: 'old',
          stitch_ticket: 'old',
        },
        {
          entity_id: '2',
          final_entity: '{}',
          entity_ref: 'k:ns/two',
          hash: 'old',
          stitch_ticket: 'old',
        },
        {
          entity_id: '3',
          final_entity: '{}',
          entity_ref: 'k:ns/three',
          hash: 'old',
          stitch_ticket: 'old',
        },
        {
          entity_id: '4',
          final_entity: '{}',
          entity_ref: 'k:ns/four',
          hash: 'old',
          stitch_ticket: 'old',
        },
      ]);

      async function result() {
        return knex<DbRefreshStateRow>('refresh_state')
          .leftJoin(
            'final_entities',
            'final_entities.entity_id',
            'refresh_state.entity_id',
          )
          .select({
            entity_id: 'refresh_state.entity_id',
            next_update_at: 'refresh_state.next_update_at',
            refresh_state_hash: 'refresh_state.result_hash',
            final_entities_hash: 'final_entities.hash',
          })
          .orderBy('entity_id', 'asc');
      }

      // Ensure that now() isn't evaluating to the same thing
      await new Promise(resolve => setTimeout(resolve, 1100));

      const original = await result();

      await markForStitching({
        knex,
        strategy: { mode: 'immediate' },
        entityRefs: new Set(),
      });
      await expect(result()).resolves.toEqual([
        {
          entity_id: '1',
          next_update_at: expect.anything(),
          refresh_state_hash: 'old',
          final_entities_hash: 'old',
        },
        {
          entity_id: '2',
          next_update_at: expect.anything(),
          refresh_state_hash: 'old',
          final_entities_hash: 'old',
        },
        {
          entity_id: '3',
          next_update_at: expect.anything(),
          refresh_state_hash: 'old',
          final_entities_hash: 'old',
        },
        {
          entity_id: '4',
          next_update_at: expect.anything(),
          refresh_state_hash: 'old',
          final_entities_hash: 'old',
        },
      ]);

      await markForStitching({
        knex,
        strategy: { mode: 'immediate' },
        entityRefs: new Set(['k:ns/one']),
      });
      await expect(result()).resolves.toEqual([
        {
          entity_id: '1',
          next_update_at: expect.anything(),
          refresh_state_hash: 'force-stitching',
          final_entities_hash: 'force-stitching',
        },
        {
          entity_id: '2',
          next_update_at: expect.anything(),
          refresh_state_hash: 'old',
          final_entities_hash: 'old',
        },
        {
          entity_id: '3',
          next_update_at: expect.anything(),
          refresh_state_hash: 'old',
          final_entities_hash: 'old',
        },
        {
          entity_id: '4',
          next_update_at: expect.anything(),
          refresh_state_hash: 'old',
          final_entities_hash: 'old',
        },
      ]);

      await markForStitching({
        knex,
        strategy: { mode: 'immediate' },
        entityRefs: ['k:ns/two'],
      });
      await expect(result()).resolves.toEqual([
        {
          entity_id: '1',
          next_update_at: expect.anything(),
          refresh_state_hash: 'force-stitching',
          final_entities_hash: 'force-stitching',
        },
        {
          entity_id: '2',
          next_update_at: expect.anything(),
          refresh_state_hash: 'force-stitching',
          final_entities_hash: 'force-stitching',
        },
        {
          entity_id: '3',
          next_update_at: expect.anything(),
          refresh_state_hash: 'old',
          final_entities_hash: 'old',
        },
        {
          entity_id: '4',
          next_update_at: expect.anything(),
          refresh_state_hash: 'old',
          final_entities_hash: 'old',
        },
      ]);

      await markForStitching({
        knex,
        strategy: { mode: 'immediate' },
        entityIds: ['3', '4'],
      });
      await expect(result()).resolves.toEqual([
        {
          entity_id: '1',
          next_update_at: expect.anything(),
          refresh_state_hash: 'force-stitching',
          final_entities_hash: 'force-stitching',
        },
        {
          entity_id: '2',
          next_update_at: expect.anything(),
          refresh_state_hash: 'force-stitching',
          final_entities_hash: 'force-stitching',
        },
        {
          entity_id: '3',
          next_update_at: expect.anything(),
          refresh_state_hash: 'force-stitching',
          final_entities_hash: 'force-stitching',
        },
        {
          entity_id: '4',
          next_update_at: expect.anything(),
          refresh_state_hash: 'force-stitching',
          final_entities_hash: 'force-stitching',
        },
      ]);

      // It overwrites timers
      const final = await result();
      for (let i = 0; i < final.length; ++i) {
        expect(original[i].next_update_at).not.toEqual(final[i].next_update_at);
      }
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
          next_stitch_at: null,
          next_stitch_ticket: null,
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
            strategy: {
              mode: 'deferred',
              pollingInterval: { seconds: 1 },
              stitchTimeout: { seconds: 1 },
            },
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
            strategy: {
              mode: 'deferred',
              pollingInterval: { seconds: 1 },
              stitchTimeout: { seconds: 1 },
            },
            entityRefs: ['k:ns/entity-f'],
          });
        });

        // Transaction 2: Update entities F, E, D, C, B (reverse order)
        const transaction2 = knex.transaction(async trx => {
          await markForStitching({
            knex: trx,
            strategy: {
              mode: 'deferred',
              pollingInterval: { seconds: 1 },
              stitchTimeout: { seconds: 1 },
            },
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
            strategy: {
              mode: 'deferred',
              pollingInterval: { seconds: 1 },
              stitchTimeout: { seconds: 1 },
            },
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
      const finalState = await knex<DbRefreshStateRow>('refresh_state')
        .select('entity_ref', 'next_stitch_at', 'next_stitch_ticket')
        .whereNotNull('next_stitch_at')
        .orderBy('entity_ref');

      expect(finalState.length).toBeGreaterThan(0);
      finalState.forEach(row => {
        expect(row.next_stitch_at).not.toBeNull();
        expect(row.next_stitch_ticket).not.toBeNull();
      });
    },
  );
});

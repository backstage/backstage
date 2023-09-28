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
  const databases = TestDatabases.create({
    ids: ['MYSQL_8', 'POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

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
          hash: 'old',
          stitch_ticket: 'old',
        },
        {
          entity_id: '2',
          final_entity: '{}',
          hash: 'old',
          stitch_ticket: 'old',
        },
        {
          entity_id: '3',
          final_entity: '{}',
          hash: 'old',
          stitch_ticket: 'old',
        },
        {
          entity_id: '4',
          final_entity: '{}',
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
});

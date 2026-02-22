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
import { markDeferredStitchCompleted } from './markDeferredStitchCompleted';
import { DbFinalEntitiesRow, DbRefreshStateRow } from '../../tables';

jest.setTimeout(60_000);

describe('markDeferredStitchCompleted', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    'completes only if unchanged %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);

      // Insert refresh_state row (needed for FK constraint)
      await knex<DbRefreshStateRow>('refresh_state').insert([
        {
          entity_id: '1',
          entity_ref: 'k:ns/n',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
        },
      ]);

      // Insert final_entities row with stitch data
      await knex<DbFinalEntitiesRow>('final_entities').insert([
        {
          entity_id: '1',
          entity_ref: 'k:ns/n',
          hash: 'h1',
          stitch_ticket: 'the-ticket',
          next_stitch_at: '1971-01-01T00:00:00.000',
        },
      ]);

      async function result() {
        return knex<DbFinalEntitiesRow>('final_entities').select(
          'next_stitch_at',
          'stitch_ticket',
        );
      }

      await markDeferredStitchCompleted({
        knex,
        entityRef: 'k:ns/n',
        stitchTicket: 'the-wrong-ticket',
      });
      await expect(result()).resolves.toEqual([
        { next_stitch_at: expect.anything(), stitch_ticket: 'the-ticket' },
      ]);

      await markDeferredStitchCompleted({
        knex,
        entityRef: 'k:ns/n',
        stitchTicket: 'the-ticket',
      });
      await expect(result()).resolves.toEqual([
        { next_stitch_at: null, stitch_ticket: 'the-ticket' },
      ]);
    },
  );
});

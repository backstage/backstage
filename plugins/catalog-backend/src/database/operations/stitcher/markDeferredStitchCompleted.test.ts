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
import { DbRefreshStateRow } from '../../tables';

jest.setTimeout(60_000);

describe('markDeferredStitchCompleted', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    'completes only if unchanged %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);

      await knex<DbRefreshStateRow>('refresh_state').insert([
        {
          entity_id: '1',
          entity_ref: 'k:ns/n',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
          next_stitch_at: '1971-01-01T00:00:00.000',
          next_stitch_ticket: 'the-ticket',
        },
      ]);

      async function result() {
        return knex<DbRefreshStateRow>('refresh_state').select(
          'next_stitch_at',
          'next_stitch_ticket',
        );
      }

      await markDeferredStitchCompleted({
        knex,
        entityRef: 'k:ns/n',
        stitchTicket: 'the-wrong-ticket',
      });
      await expect(result()).resolves.toEqual([
        { next_stitch_at: expect.anything(), next_stitch_ticket: 'the-ticket' },
      ]);

      await markDeferredStitchCompleted({
        knex,
        entityRef: 'k:ns/n',
        stitchTicket: 'the-ticket',
      });
      await expect(result()).resolves.toEqual([
        { next_stitch_at: null, next_stitch_ticket: null },
      ]);
    },
  );
});

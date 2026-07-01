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
import { DbStitchQueueRow } from '../../tables';

jest.setTimeout(60_000);

const databases = TestDatabases.create();

describe.each(databases.eachSupportedId())(
  'markDeferredStitchCompleted, %p',
  databaseId => {
    it('completes only if unchanged', async () => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);

      // Insert stitch_queue row
      await knex<DbStitchQueueRow>('stitch_queue').insert([
        {
          entity_ref: 'k:ns/n',
          stitch_ticket: 'the-ticket',
          next_stitch_at: '1971-01-01T00:00:00.000',
        },
      ]);

      async function result() {
        return knex<DbStitchQueueRow>('stitch_queue').select(
          'entity_ref',
          'next_stitch_at',
          'stitch_ticket',
        );
      }

      // Wrong ticket should not delete the row, but should bump
      // next_stitch_at to now() so the pending re-stitch is picked up
      // immediately
      await markDeferredStitchCompleted({
        knex,
        entityRef: 'k:ns/n',
        stitchTicket: 'the-wrong-ticket',
        result: 'succeeded',
      });
      const afterWrongTicket = await result();
      expect(afterWrongTicket).toEqual([
        {
          entity_ref: 'k:ns/n',
          next_stitch_at: expect.anything(),
          stitch_ticket: 'the-ticket',
        },
      ]);
      const bumped = new Date(afterWrongTicket[0].next_stitch_at as string);
      expect(bumped.getFullYear()).toBeGreaterThan(1971);

      // Correct ticket should delete the row
      await markDeferredStitchCompleted({
        knex,
        entityRef: 'k:ns/n',
        stitchTicket: 'the-ticket',
        result: 'succeeded',
      });
      await expect(result()).resolves.toEqual([]);
    });

    it('does not fail when the row is already gone', async () => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);

      // Calling on a nonexistent row should not throw
      await expect(
        markDeferredStitchCompleted({
          knex,
          entityRef: 'k:ns/nonexistent',
          stitchTicket: 'any-ticket',
          result: 'succeeded',
        }),
      ).resolves.toBeUndefined();
    });
  },
);

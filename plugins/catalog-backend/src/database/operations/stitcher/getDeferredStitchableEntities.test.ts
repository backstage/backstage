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
import { DbStitchQueueRow } from '../../tables';
import { getDeferredStitchableEntities } from './getDeferredStitchableEntities';

jest.setTimeout(60_000);

describe('getDeferredStitchableEntities', () => {
  const databases = TestDatabases.create();

  it.each(databases.eachSupportedId())(
    'selects the right rows %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);

      // Insert stitch_queue rows - no need for refresh_state rows since
      // stitch_queue is a standalone table
      await knex<DbStitchQueueRow>('stitch_queue').insert([
        {
          entity_ref: 'k:ns/future_stitch_time',
          stitch_ticket: 't1',
          next_stitch_at: '2037-01-01T00:00:00.000',
        },
        {
          entity_ref: 'k:ns/past_stitch_time',
          stitch_ticket: 't3',
          next_stitch_at: '1971-01-01T00:00:00.000',
        },
        {
          entity_ref: 'k:ns/past_stitch_time_again',
          stitch_ticket: 't4',
          next_stitch_at: '1972-01-01T00:00:00.000',
        },
      ]);

      const rowsBefore = await knex<DbStitchQueueRow>('stitch_queue');

      const items = await getDeferredStitchableEntities({
        knex,
        batchSize: 1,
        stitchTimeout: { seconds: 2 },
      });

      const rowsAfter = await knex<DbStitchQueueRow>('stitch_queue');

      expect(items).toEqual([
        {
          entityRef: 'k:ns/past_stitch_time',
          stitchTicket: 't3',
          stitchRequestedAt: expect.anything(),
        },
      ]);

      const hitRowBefore = rowsBefore.filter(
        r => r.entity_ref === 'k:ns/past_stitch_time',
      )[0].next_stitch_at;
      const hitRowAfter = rowsAfter.filter(
        r => r.entity_ref === 'k:ns/past_stitch_time',
      )[0].next_stitch_at;
      const missRowBefore = rowsBefore.filter(
        r => r.entity_ref === 'k:ns/past_stitch_time_again',
      )[0].next_stitch_at;
      const missRowAfter = rowsAfter.filter(
        r => r.entity_ref === 'k:ns/past_stitch_time_again',
      )[0].next_stitch_at;

      expect(+new Date(hitRowAfter!)).toBeGreaterThan(+new Date(hitRowBefore!));
      expect(+new Date(missRowAfter!)).toEqual(+new Date(missRowBefore!));
    },
  );
});

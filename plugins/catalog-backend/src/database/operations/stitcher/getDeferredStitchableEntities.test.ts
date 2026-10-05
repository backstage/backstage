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

const databases = TestDatabases.create();

describe.each(databases.eachSupportedId())(
  'getDeferredStitchableEntities, %p',
  databaseId => {
    it('claims a batch with per-ref leases and leaves future work untouched', async () => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);
      await knex<DbStitchQueueRow>('stitch_queue').insert([
        {
          entity_ref: 'k:ns/a',
          stitch_ticket: 'a',
          next_stitch_at: '1971-01-01T00:00:00.000',
        },
        {
          entity_ref: 'k:ns/b',
          stitch_ticket: 'b',
          next_stitch_at: '1972-01-01T00:00:00.000',
        },
        {
          entity_ref: 'k:ns/future',
          stitch_ticket: 'future',
          next_stitch_at: '2099-01-01T00:00:00.000',
        },
      ]);
      const futureBefore = await knex('stitch_queue')
        .where('entity_ref', 'k:ns/future')
        .first();
      const items = await getDeferredStitchableEntities({
        knex,
        batchSize: 10,
        stitchTimeout: { minutes: 1 },
      });
      expect(items.map(i => i.entityRef)).toEqual(['k:ns/a', 'k:ns/b']);
      expect(items.map(i => i.stitchRequestedAt.year)).toEqual([1971, 1972]);
      for (const item of items) {
        const row = await knex('stitch_queue')
          .where('entity_ref', item.entityRef)
          .first();
        expect(item.stitchTicket).toBe(row.stitch_ticket);
        expect(['a', 'b']).not.toContain(item.stitchTicket);
        // Compare the exact database representation, not JavaScript Dates:
        // PostgreSQL's driver and Date parsing can round microseconds differently.
        const exact = await knex('stitch_queue')
          .select(
            knex.raw(
              databaseId.startsWith('POSTGRES')
                ? 'next_stitch_at::text as lease'
                : 'next_stitch_at as lease',
            ),
          )
          .where('entity_ref', item.entityRef)
          .first();
        expect(item.stitchLeaseExpiresAt).toEqual(exact.lease);
      }
      await expect(
        knex('stitch_queue').where('entity_ref', 'k:ns/future').first(),
      ).resolves.toEqual(futureBefore);
      const beforeEmpty = await knex('stitch_queue').orderBy('entity_ref');
      await expect(
        getDeferredStitchableEntities({
          knex,
          batchSize: 10,
          stitchTimeout: { minutes: 1 },
        }),
      ).resolves.toEqual([]);
      await expect(knex('stitch_queue').orderBy('entity_ref')).resolves.toEqual(
        beforeEmpty,
      );
    });

    it('does not persist a claim when its caller transaction rolls back', async () => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);
      await knex('stitch_queue').insert({
        entity_ref: 'k:ns/n',
        stitch_ticket: 'original',
        next_stitch_at: '1971-01-01T00:00:00.000',
      });
      const before = await knex('stitch_queue');
      await expect(
        knex.transaction(async tx => {
          const [claim] = await getDeferredStitchableEntities({
            knex: tx,
            batchSize: 1,
            stitchTimeout: { minutes: 1 },
          });
          expect(claim.stitchTicket).not.toBe('original');
          expect((await tx('stitch_queue').first()).stitch_ticket).toBe(
            claim.stitchTicket,
          );
          throw new Error('abort caller transaction');
        }),
      ).rejects.toThrow('abort caller transaction');
      await expect(knex('stitch_queue')).resolves.toEqual(before);
      const [retried] = await getDeferredStitchableEntities({
        knex,
        batchSize: 1,
        stitchTimeout: { minutes: 1 },
      });
      expect(retried.entityRef).toBe('k:ns/n');
    });

    if (databaseId.startsWith('POSTGRES')) {
      it("skips another worker's locked row and claims it after release", async () => {
        const knex = await databases.init(databaseId);
        await applyDatabaseMigrations(knex);
        await knex('stitch_queue').insert([
          {
            entity_ref: 'k:ns/a',
            stitch_ticket: 'a',
            next_stitch_at: '1971-01-01T00:00:00.000',
          },
          {
            entity_ref: 'k:ns/b',
            stitch_ticket: 'b',
            next_stitch_at: '1972-01-01T00:00:00.000',
          },
        ]);
        const owner = await knex.transaction();
        try {
          await owner('stitch_queue').where('entity_ref', 'k:ns/a').forUpdate();
          const items = await knex.transaction(async tx => {
            await tx.raw("set local statement_timeout = '2s'");
            return getDeferredStitchableEntities({
              knex: tx,
              batchSize: 2,
              stitchTimeout: { minutes: 1 },
            });
          });
          expect(items.map(i => i.entityRef)).toEqual(['k:ns/b']);
          expect(
            (await owner('stitch_queue').where('entity_ref', 'k:ns/a').first())
              .stitch_ticket,
          ).toBe('a');
        } finally {
          await owner.rollback();
        }
        const items = await getDeferredStitchableEntities({
          knex,
          batchSize: 2,
          stitchTimeout: { minutes: 1 },
        });
        expect(items.map(i => i.entityRef)).toEqual(['k:ns/a']);
      });
    }

    it('selects the right rows', async () => {
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
          stitchTicket: expect.any(String),
          stitchRequestedAt: expect.anything(),
          stitchLeaseExpiresAt: expect.anything(),
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
      expect(items[0].stitchTicket).not.toBe('t3');
      expect(
        rowsAfter.find(r => r.entity_ref === items[0].entityRef)?.stitch_ticket,
      ).toBe(items[0].stitchTicket);
      expect(
        rowsAfter.find(r => r.entity_ref === 'k:ns/past_stitch_time_again')
          ?.stitch_ticket,
      ).toBe('t4');
    });
  },
);

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
import { getDeferredStitchableEntities } from './getDeferredStitchableEntities';
import { markForStitching } from './markForStitching';

jest.setTimeout(60_000);

const databases = TestDatabases.create();

describe.each(databases.eachSupportedId())(
  'markDeferredStitchCompleted, %p',
  databaseId => {
    it('does not disturb a successor after a stale completion', async () => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);
      await markForStitching({ knex, entityRefs: ['k:ns/n'] });
      const [expired] = await getDeferredStitchableEntities({
        knex,
        batchSize: 1,
        stitchTimeout: { seconds: 0 },
      });
      const [successor] = await getDeferredStitchableEntities({
        knex,
        batchSize: 1,
        stitchTimeout: { minutes: 1 },
      });
      expect(successor.stitchTicket).not.toBe(expired.stitchTicket);
      const before = await knex<DbStitchQueueRow>('stitch_queue');
      await markDeferredStitchCompleted({ knex, ...expired });
      await expect(knex<DbStitchQueueRow>('stitch_queue')).resolves.toEqual(
        before,
      );
      // Even another request for the successor must not give an expired worker
      // permission to shorten that successor's lease.
      await markForStitching({ knex, entityRefs: ['k:ns/n'] });
      const afterRequest = await knex('stitch_queue');
      await markDeferredStitchCompleted({ knex, ...expired });
      await expect(knex('stitch_queue')).resolves.toEqual(afterRequest);
      await markDeferredStitchCompleted({
        knex,
        ...successor,
      });
      const [followUp] = await getDeferredStitchableEntities({
        knex,
        batchSize: 1,
        stitchTimeout: { minutes: 1 },
      });
      expect(followUp).toBeDefined();
      await markDeferredStitchCompleted({ knex, ...followUp });
      await expect(knex('stitch_queue')).resolves.toEqual([]);
    });

    it('preserves an old-worker reclaim that retains the ticket', async () => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);
      await markForStitching({ knex, entityRefs: ['k:ns/n'] });
      const [expired] = await getDeferredStitchableEntities({
        knex,
        batchSize: 1,
        stitchTimeout: { seconds: 0 },
      });

      // Old workers reclaim by advancing only the lease, without replacing
      // the ticket. Use a fixed future lease instead of waiting for a timeout.
      await knex<DbStitchQueueRow>('stitch_queue')
        .where('entity_ref', expired.entityRef)
        .update({ next_stitch_at: '2099-01-01 00:00:00' });
      const reclaimed = await knex<DbStitchQueueRow>('stitch_queue');
      expect(reclaimed[0].stitch_ticket).toBe(expired.stitchTicket);
      await markDeferredStitchCompleted({ knex, ...expired });
      await expect(knex<DbStitchQueueRow>('stitch_queue')).resolves.toEqual(
        reclaimed,
      );

      // A later request must not let the expired worker shorten that lease
      // through the fallback update either.
      await markForStitching({ knex, entityRefs: [expired.entityRef] });
      const requested = await knex<DbStitchQueueRow>('stitch_queue');
      expect(requested[0].stitch_ticket).not.toBe(expired.stitchTicket);
      await markDeferredStitchCompleted({ knex, ...expired });
      await expect(knex<DbStitchQueueRow>('stitch_queue')).resolves.toEqual(
        requested,
      );
      await expect(
        getDeferredStitchableEntities({
          knex,
          batchSize: 1,
          stitchTimeout: { minutes: 1 },
        }),
      ).resolves.toEqual([]);
    });

    it('makes a new request eligible when the same lease finishes', async () => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);
      await markForStitching({ knex, entityRefs: ['k:ns/n'] });
      const [claim] = await getDeferredStitchableEntities({
        knex,
        batchSize: 1,
        stitchTimeout: { minutes: 1 },
      });
      await markForStitching({ knex, entityRefs: ['k:ns/n'] });
      await markForStitching({ knex, entityRefs: ['k:ns/n'] });
      const requested = await knex('stitch_queue').first();
      await markDeferredStitchCompleted({
        knex,
        ...claim,
      });
      const [followUp] = await getDeferredStitchableEntities({
        knex,
        batchSize: 1,
        stitchTimeout: { minutes: 1 },
      });
      expect(followUp).toBeDefined();
      expect(followUp.stitchTicket).not.toBe(claim.stitchTicket);
      expect(followUp.stitchTicket).not.toBe(requested.stitch_ticket);
      await markDeferredStitchCompleted({ knex, ...followUp });
      await markDeferredStitchCompleted({ knex, ...followUp });
      await expect(knex('stitch_queue')).resolves.toEqual([]);
    });

    it('scopes completion by ref even when tickets are shared', async () => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);
      await markForStitching({ knex, entityRefs: ['k:ns/a', 'k:ns/b'] });
      const claims = await getDeferredStitchableEntities({
        knex,
        batchSize: 2,
        stitchTimeout: { minutes: 1 },
      });
      const a = claims.find(claim => claim.entityRef === 'k:ns/a')!;
      const b = claims.find(claim => claim.entityRef === 'k:ns/b')!;
      expect(a.stitchTicket).toBe(b.stitchTicket);
      const other = await knex('stitch_queue')
        .where('entity_ref', b.entityRef)
        .first();
      await markDeferredStitchCompleted({ knex, ...a });
      // Repeated completion of a removed row must not affect another ref.
      await markDeferredStitchCompleted({ knex, ...a });
      await expect(knex('stitch_queue')).resolves.toEqual([other]);
      await markDeferredStitchCompleted({ knex, ...b });
      await expect(knex('stitch_queue')).resolves.toEqual([]);
    });
  },
);

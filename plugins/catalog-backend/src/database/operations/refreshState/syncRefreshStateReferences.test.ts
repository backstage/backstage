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

import { TestDatabases } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import { applyDatabaseMigrations } from '../../migrations';
import { syncRefreshStateReferences } from './syncRefreshStateReferences';

jest.setTimeout(60_000);

const databases = TestDatabases.create();

describe.each(databases.eachSupportedId())(
  'syncRefreshStateReferences, %p',
  databaseId => {
    let knex: Knex;

    async function setup() {
      knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);

      for (const ref of ['k:ns/a', 'k:ns/b', 'k:ns/c', 'k:ns/d']) {
        await knex('refresh_state').insert({
          entity_id: `id-${ref}`,
          entity_ref: ref,
          unprocessed_entity: '{}',
          errors: '[]',
          next_update_at: new Date(),
          last_discovery_at: new Date(),
        });
      }
    }

    async function getRefs(source: Record<string, string>) {
      return knex('refresh_state_references')
        .where(source)
        .orderBy('target_entity_ref')
        .select('target_entity_ref')
        .then(rows => rows.map(r => r.target_entity_ref));
    }

    async function getAllRefs() {
      return knex('refresh_state_references')
        .orderBy(['source_entity_ref', 'source_key', 'target_entity_ref'])
        .select();
    }

    it('inserts all refs when none exist', async () => {
      await setup();

      await syncRefreshStateReferences(knex, { sourceEntityRef: 'k:ns/a' }, [
        'k:ns/b',
        'k:ns/c',
      ]);

      expect(await getRefs({ source_entity_ref: 'k:ns/a' })).toEqual([
        'k:ns/b',
        'k:ns/c',
      ]);
    });

    it('is a no-op when desired refs match existing refs', async () => {
      await setup();
      await knex('refresh_state_references').insert([
        { source_entity_ref: 'k:ns/a', target_entity_ref: 'k:ns/b' },
        { source_entity_ref: 'k:ns/a', target_entity_ref: 'k:ns/c' },
      ]);

      await syncRefreshStateReferences(knex, { sourceEntityRef: 'k:ns/a' }, [
        'k:ns/b',
        'k:ns/c',
      ]);

      expect(await getRefs({ source_entity_ref: 'k:ns/a' })).toEqual([
        'k:ns/b',
        'k:ns/c',
      ]);
    });

    it('applies a partial diff — adds new, removes stale, keeps unchanged', async () => {
      await setup();
      await knex('refresh_state_references').insert([
        { source_entity_ref: 'k:ns/a', target_entity_ref: 'k:ns/b' },
        { source_entity_ref: 'k:ns/a', target_entity_ref: 'k:ns/c' },
      ]);

      await syncRefreshStateReferences(knex, { sourceEntityRef: 'k:ns/a' }, [
        'k:ns/c',
        'k:ns/d',
      ]);

      expect(await getRefs({ source_entity_ref: 'k:ns/a' })).toEqual([
        'k:ns/c',
        'k:ns/d',
      ]);
    });

    it('removes all refs when desired set is empty', async () => {
      await setup();
      await knex('refresh_state_references').insert([
        { source_entity_ref: 'k:ns/a', target_entity_ref: 'k:ns/b' },
        { source_entity_ref: 'k:ns/a', target_entity_ref: 'k:ns/c' },
      ]);

      await syncRefreshStateReferences(knex, { sourceEntityRef: 'k:ns/a' }, []);

      expect(await getRefs({ source_entity_ref: 'k:ns/a' })).toEqual([]);
    });

    it('deduplicates input refs', async () => {
      await setup();

      await syncRefreshStateReferences(knex, { sourceEntityRef: 'k:ns/a' }, [
        'k:ns/b',
        'k:ns/b',
        'k:ns/c',
        'k:ns/c',
      ]);

      expect(await getRefs({ source_entity_ref: 'k:ns/a' })).toEqual([
        'k:ns/b',
        'k:ns/c',
      ]);
    });

    it('does not touch refs from other sources', async () => {
      await setup();
      await knex('refresh_state_references').insert([
        { source_entity_ref: 'k:ns/a', target_entity_ref: 'k:ns/c' },
        { source_entity_ref: 'k:ns/b', target_entity_ref: 'k:ns/c' },
        { source_key: 'provider-x', target_entity_ref: 'k:ns/c' },
      ]);

      await syncRefreshStateReferences(knex, { sourceEntityRef: 'k:ns/a' }, []);

      expect(await getRefs({ source_entity_ref: 'k:ns/a' })).toEqual([]);
      expect(await getRefs({ source_entity_ref: 'k:ns/b' })).toEqual([
        'k:ns/c',
      ]);
      expect(await getRefs({ source_key: 'provider-x' })).toEqual(['k:ns/c']);
    });

    it('works with sourceKey variant', async () => {
      await setup();
      await knex('refresh_state_references').insert([
        { source_key: 'my-provider', target_entity_ref: 'k:ns/a' },
        { source_key: 'my-provider', target_entity_ref: 'k:ns/b' },
      ]);

      await syncRefreshStateReferences(knex, { sourceKey: 'my-provider' }, [
        'k:ns/b',
        'k:ns/c',
      ]);

      expect(await getRefs({ source_key: 'my-provider' })).toEqual([
        'k:ns/b',
        'k:ns/c',
      ]);
    });

    it('is idempotent when called twice with the same desired set', async () => {
      await setup();

      await syncRefreshStateReferences(knex, { sourceEntityRef: 'k:ns/a' }, [
        'k:ns/b',
        'k:ns/c',
      ]);
      const after1 = await getAllRefs();

      await syncRefreshStateReferences(knex, { sourceEntityRef: 'k:ns/a' }, [
        'k:ns/b',
        'k:ns/c',
      ]);
      const after2 = await getAllRefs();

      expect(after1).toEqual(after2);
    });

    it('rolls back the entire replacement if an insert fails', async () => {
      await setup();
      await knex('refresh_state_references').insert([
        { source_entity_ref: 'k:ns/a', target_entity_ref: 'k:ns/b' },
        { source_entity_ref: 'k:ns/a', target_entity_ref: 'k:ns/c' },
      ]);

      await expect(
        syncRefreshStateReferences(knex, { sourceEntityRef: 'k:ns/a' }, [
          'k:ns/d',
          'k:ns/missing',
        ]),
      ).rejects.toThrow();

      expect(await getRefs({ source_entity_ref: 'k:ns/a' })).toEqual([
        'k:ns/b',
        'k:ns/c',
      ]);
    });

    it('serializes concurrent replacements of the same source', async () => {
      if (!databaseId.includes('POSTGRES')) {
        return;
      }
      await setup();

      let releaseFirst!: () => void;
      const holdFirst = new Promise<void>(resolve => {
        releaseFirst = resolve;
      });
      let firstReady!: () => void;
      const waitForFirst = new Promise<void>(resolve => {
        firstReady = resolve;
      });

      const first = knex.transaction(async trx => {
        await syncRefreshStateReferences(trx, { sourceEntityRef: 'k:ns/a' }, [
          'k:ns/b',
        ]);
        firstReady();
        await holdFirst;
      });
      await waitForFirst;

      let secondPid: number | undefined;
      let secondReady!: () => void;
      const waitForSecond = new Promise<void>(resolve => {
        secondReady = resolve;
      });
      const second = knex.transaction(async trx => {
        secondPid = Number(
          (await trx.raw('SELECT pg_backend_pid() AS pid')).rows[0].pid,
        );
        secondReady();
        await syncRefreshStateReferences(trx, { sourceEntityRef: 'k:ns/a' }, [
          'k:ns/c',
        ]);
      });
      await waitForSecond;

      let sawLockWait = false;
      for (let attempt = 0; attempt < 100; attempt++) {
        const waiting = await knex.raw(
          `SELECT EXISTS (
             SELECT 1 FROM pg_locks
             WHERE pid = ?
               AND locktype = 'advisory'
               AND NOT granted
           ) AS waiting`,
          [secondPid],
        );
        if (waiting.rows[0].waiting) {
          sawLockWait = true;
          break;
        }
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      releaseFirst();
      await Promise.all([first, second]);

      expect(sawLockWait).toBe(true);
      expect(await getRefs({ source_entity_ref: 'k:ns/a' })).toEqual([
        'k:ns/c',
      ]);
    });

    it('serializes concurrent MySQL replacements of the same source', async () => {
      if (!databaseId.includes('MYSQL')) {
        return;
      }
      await setup();

      let releaseFirst!: () => void;
      const holdFirst = new Promise<void>(resolve => {
        releaseFirst = resolve;
      });
      let firstReady!: () => void;
      const waitForFirst = new Promise<void>(resolve => {
        firstReady = resolve;
      });

      const first = knex.transaction(async trx => {
        await syncRefreshStateReferences(trx, { sourceEntityRef: 'k:ns/a' }, [
          'k:ns/b',
        ]);
        firstReady();
        await holdFirst;
      });
      await waitForFirst;

      let secondReady!: () => void;
      const waitForSecond = new Promise<void>(resolve => {
        secondReady = resolve;
      });
      let secondSettled = false;
      const second = knex
        .transaction(async trx => {
          secondReady();
          await syncRefreshStateReferences(trx, { sourceEntityRef: 'k:ns/a' }, [
            'k:ns/c',
          ]);
        })
        .finally(() => {
          secondSettled = true;
        });
      await waitForSecond;
      await new Promise(resolve => setTimeout(resolve, 100));
      const secondWaitedForFirst = !secondSettled;

      releaseFirst();
      await Promise.all([first, second]);

      expect(secondWaitedForFirst).toBe(true);
      expect(await getRefs({ source_entity_ref: 'k:ns/a' })).toEqual([
        'k:ns/c',
      ]);
    });
  },
);

it('propagates MySQL deadlocks to the owning transaction', async () => {
  const deadlock = Object.assign(new Error('deadlock'), { errno: 1213 });
  const transaction = jest.fn().mockRejectedValue(deadlock);
  const knex = {
    client: { config: { client: 'mysql2' } },
    transaction,
  } as unknown as Knex;

  await expect(
    syncRefreshStateReferences(knex, { sourceKey: 'provider' }, []),
  ).rejects.toBe(deadlock);
  expect(transaction).toHaveBeenCalledTimes(1);
});

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

import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import knex, { type Knex } from 'knex';
import { BACKGROUND_CONTEXT } from '@earendil-works/chord/context';
import { createAttemptJournal } from '../journal/knex';
import { createKnexStorage } from './knex';
import * as kit from './dialect-kit';

jest.mock('./dialect-kit', () => {
  const actual =
    jest.requireActual<typeof import('./dialect-kit')>('./dialect-kit');
  return { ...actual, fencedTransaction: jest.fn(actual.fencedTransaction) };
});

const storageMigration = require('../../migrations/1000_storage');
const journalMigration = require('../../migrations/4000_journal');

const namespace = { pluginId: 'plugin', sessionId: 'session' };
const key = { plugin_id: namespace.pluginId, session_id: namespace.sessionId };
const fence = { namespace, owner: 'owner', token: '1' };
const pgUrl = process.env.AI_TEST_POSTGRES_URL;

async function fixture(dialect: 'sqlite' | 'pg') {
  let db: Knex;
  let cleanup: () => Promise<void>;
  if (dialect === 'sqlite') {
    const dir = await mkdtemp(join(tmpdir(), 'ai-dialect-'));
    db = knex({
      client: 'better-sqlite3',
      connection: { filename: join(dir, 'db.sqlite') },
      useNullAsDefault: true,
    });
    cleanup = async () => {
      await db.destroy();
      await rm(dir, { recursive: true, force: true });
    };
  } else {
    const admin = knex({ client: 'pg', connection: pgUrl });
    const schema = `ai_test_${randomUUID().replace(/-/g, '')}`;
    await admin.schema.createSchema(schema);
    db = knex({ client: 'pg', connection: pgUrl, searchPath: [schema] });
    cleanup = async () => {
      await db.destroy();
      await admin.schema.dropSchema(schema, true);
      await admin.destroy();
    };
  }
  try {
    await storageMigration.up(db);
    await journalMigration.up(db);
    await db('ai_namespace_leases').insert({
      ...key,
      owner_id: fence.owner,
      token: fence.token,
      expires_at:
        dialect === 'sqlite'
          ? db.raw("(julianday('now') - 2440587.5) * 86400000 + 60000")
          : db.raw("statement_timestamp() + interval '60 seconds'"),
    });
    return { db, cleanup };
  } catch (error) {
    await cleanup();
    throw error;
  }
}

if (!pgUrl) {
  // eslint-disable-next-line jest/no-disabled-tests, jest/expect-expect
  it.skip('PostgreSQL kit tests require AI_TEST_POSTGRES_URL', () => {});
}

for (const dialect of [
  'sqlite',
  ...(pgUrl ? (['pg'] as const) : []),
] as const) {
  describe(`dialect kit (${dialect})`, () => {
    it('checks expiry and keeps bigint values as text', async () => {
      const { db, cleanup } = await fixture(dialect);
      try {
        await db.schema.createTable('big_values', table =>
          table.bigInteger('value'),
        );
        await db('big_values').insert([
          { value: '9007199254740993' },
          { value: '9223372036854775807' },
          { value: null },
        ]);
        const rows = await db('big_values')
          .orderBy('value')
          .select(kit.bigintText(db, 'value'));
        expect(rows.map(row => row.value).filter(Boolean)).toEqual([
          '9007199254740993',
          '9223372036854775807',
        ]);
        expect(rows.some(row => row.value === null)).toBe(true);
        await kit.fencedTransaction(
          db,
          key,
          fence,
          'stale',
          async () => undefined,
          async trx => {
            const now = await trx.select({ value: kit.dbNow(trx) }).first();
            expect(new Date(now.value).getTime()).not.toBeNaN();
          },
        );
        for (const wrongFence of [
          { ...fence, owner: 'other' },
          { ...fence, token: '2' },
        ]) {
          await expect(
            kit.fencedTransaction(
              db,
              key,
              wrongFence,
              'stale',
              async () => undefined,
              async () => undefined,
            ),
          ).rejects.toThrow('stale');
        }
        const expired =
          dialect === 'sqlite'
            ? db.raw("(julianday('now') - 2440587.5) * 86400000 - 10000")
            : db.raw("statement_timestamp() - interval '10 seconds'");
        await db('ai_namespace_leases')
          .where(key)
          .update({ expires_at: expired });
        await expect(
          kit.fencedTransaction(
            db,
            key,
            fence,
            'stale',
            async () => undefined,
            async () => undefined,
          ),
        ).rejects.toThrow('stale');
      } finally {
        await cleanup();
      }
    });

    if (dialect === 'sqlite') {
      it('compares SQLite text expiry dates against the database clock', async () => {
        const { db, cleanup } = await fixture(dialect);
        try {
          const run = () =>
            kit.fencedTransaction(
              db,
              key,
              fence,
              'stale',
              async () => undefined,
              async () => 'ok',
            );
          await db('ai_namespace_leases')
            .where(key)
            .update({ expires_at: db.raw("datetime('now', '+60 seconds')") });
          await expect(run()).resolves.toBe('ok');
          await db('ai_namespace_leases')
            .where(key)
            .update({ expires_at: db.raw("datetime('now', '-60 seconds')") });
          await expect(run()).rejects.toThrow('stale');
        } finally {
          await cleanup();
        }
      });
    }

    it('retries only safe preparation failures and rolls back later failures', async () => {
      const { db, cleanup } = await fixture(dialect);
      try {
        await db.schema.createTable('writes', table => table.integer('value'));
        let preparations = 0;
        const transient = Object.assign(new Error('busy'), {
          code: dialect === 'sqlite' ? 'SQLITE_BUSY' : '40001',
        });
        await kit.fencedTransaction(
          db,
          key,
          fence,
          'stale',
          async trx => {
            preparations += 1;
            await trx('writes').insert({ value: preparations });
            if (preparations === 1) throw transient;
          },
          async () => undefined,
          { retryPreparation: true },
        );
        expect(preparations).toBe(2);
        expect(await db('writes').select('value')).toEqual([{ value: 2 }]);
        let failedPreparation = 0;
        await expect(
          kit.fencedTransaction(
            db,
            key,
            fence,
            'stale',
            async () => {
              failedPreparation += 1;
              throw transient;
            },
            async () => undefined,
          ),
        ).rejects.toBe(transient);
        expect(failedPreparation).toBe(1);
        let attempts = 0;
        await expect(
          kit.fencedTransaction(
            db,
            key,
            fence,
            'stale',
            async () => undefined,
            async trx => {
              attempts += 1;
              await trx('writes').insert({ value: 3 });
              throw transient;
            },
          ),
        ).rejects.toBe(transient);
        expect(attempts).toBe(1);
        expect(await db('writes').select('value')).toEqual([{ value: 2 }]);
      } finally {
        await cleanup();
      }
    });

    it('routes storage and journal writes through the shared transaction', async () => {
      const { db, cleanup } = await fixture(dialect);
      const spy = jest.mocked(kit.fencedTransaction);
      spy.mockClear();
      const storage = await createKnexStorage({ db, namespace, fence });
      try {
        await storage.mintId();
        expect(spy).toHaveBeenCalledTimes(1);
        spy.mockClear();
        const journal = createAttemptJournal({
          db,
          authorizer: { authorizeAuditRead: async () => true },
        });
        await journal.recordDecisionAndIntent(fence, {
          actor: 'user:default/alice',
          conversationId: 'conv',
          taskId: 'task',
          callId: 'call',
          definitionVersion: 'v1',
          configVersion: 'v1',
          provider: 'openai',
          model: 'gpt-4o',
          operation: 'models.stream',
          attempt: 1,
          decision: 'allow',
        });
        expect(spy).toHaveBeenCalledTimes(1);
      } finally {
        spy.mockClear();
        await storage.close(BACKGROUND_CONTEXT);
        await cleanup();
      }
    });

    if (dialect === 'pg') {
      it('checks expiry with a fresh statement clock after waiting for the lease lock', async () => {
        const { db, cleanup } = await fixture(dialect);
        const holder = await db.transaction();
        let observed: Promise<unknown> | undefined;
        try {
          const pid = (await holder.raw('select pg_backend_pid() as pid'))
            .rows[0].pid;
          await holder('ai_namespace_leases')
            .where(key)
            .update({
              expires_at: holder.raw(
                "statement_timestamp() + interval '3 seconds'",
              ),
            });
          const expiry = (
            await holder('ai_namespace_leases').where(key).first('expires_at')
          ).expires_at;
          const pending = kit.fencedTransaction(
            db,
            key,
            fence,
            'stale',
            async () => undefined,
            async () => 'unexpected',
          );
          observed = pending.then(
            value => ({ value }),
            error => ({ error }),
          );
          let blocked = false;
          const deadline = Date.now() + 2000;
          while (!blocked && Date.now() < deadline) {
            const result = await db.raw(
              'select exists (select 1 from pg_stat_activity where ? = any(pg_blocking_pids(pid))) as blocked',
              [pid],
            );
            blocked = result.rows[0].blocked;
            if (!blocked) await new Promise(resolve => setTimeout(resolve, 20));
          }
          expect(blocked).toBe(true);
          const before = await db.raw(
            'select statement_timestamp() < ?::timestamptz as unexpired',
            [expiry],
          );
          expect(before.rows[0].unexpired).toBe(true);
          await db.raw('select pg_sleep(3.2)');
          await holder.commit();
          expect(await observed).toMatchObject({
            error: expect.objectContaining({ message: 'stale' }),
          });
        } finally {
          if (!holder.isCompleted()) await holder.rollback();
          await observed;
          await cleanup();
        }
      }, 12000);
    }
  });
}

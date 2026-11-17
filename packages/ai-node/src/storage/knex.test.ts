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
import { execFile, spawn } from 'node:child_process';
import { once } from 'node:events';
import { promisify } from 'node:util';
import { pathToFileURL } from 'node:url';
import knex, { type Knex } from 'knex';
import { BACKGROUND_CONTEXT as context } from '@earendil-works/chord/context';
import {
  ROOT_CONVERSATION_ID,
  type ConversationId,
  type DocumentId,
  type EntryId,
  type Storage,
} from '@earendil-works/pi-durable';
import { registerStorageConformance } from '@earendil-works/pi-durable/testing';
import { createKnexStorage } from './knex';

const migration = require('../../migrations/1000_storage');

const namespace = { pluginId: 'plugin', sessionId: 'session' };
const fence = { namespace, owner: 'owner', token: '1' };
const key = { plugin_id: namespace.pluginId, session_id: namespace.sessionId };
const pgUrl = process.env.AI_TEST_POSTGRES_URL;

function leaseTime(db: Knex, dialect: 'sqlite' | 'pg', seconds: number) {
  return dialect === 'sqlite'
    ? db.raw("(julianday('now') - 2440587.5) * 86400000 + ?", [seconds * 1000])
    : db.raw("statement_timestamp() + (? * interval '1 second')", [seconds]);
}

type Fixture = {
  db: Knex;
  storage: Storage;
  filename?: string;
  cleanup(): Promise<void>;
};

async function fixture(dialect: 'sqlite' | 'pg'): Promise<Fixture> {
  let db: Knex;
  let cleanup: () => Promise<void>;
  let filename: string | undefined;
  if (dialect === 'sqlite') {
    const dir = await mkdtemp(join(tmpdir(), 'ai-storage-'));
    filename = join(dir, 'storage.sqlite');
    db = knex({
      client: 'better-sqlite3',
      connection: { filename },
      useNullAsDefault: true,
      pool: { min: 1, max: 1 },
    });
    await db.raw('PRAGMA busy_timeout = 5000');
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
    await migration.up(db);
    await db('ai_namespace_leases').insert({
      ...key,
      owner_id: fence.owner,
      token: fence.token,
      expires_at: leaseTime(db, dialect, 60),
    });
    const storage = await createKnexStorage({ db, namespace, fence });
    return { db, storage, filename, cleanup };
  } catch (error) {
    await cleanup();
    throw error;
  }
}

if (!pgUrl) {
  it.skip('PostgreSQL conformance requires AI_TEST_POSTGRES_URL', () => {});
}

it('rejects in-memory SQLite', async () => {
  const db = knex({
    client: 'better-sqlite3',
    connection: { filename: ':memory:' },
    useNullAsDefault: true,
  });
  try {
    await expect(createKnexStorage({ db, namespace, fence })).rejects.toThrow(
      'file-backed',
    );
  } finally {
    await db.destroy();
  }
});

for (const dialect of [
  'sqlite',
  ...(pgUrl ? (['pg'] as const) : []),
] as const) {
  registerStorageConformance(
    // The upstream runner invokes the returned matcher itself.
    // eslint-disable-next-line jest/valid-expect
    { describe, it, expect: actual => expect(actual) },
    `Knex ${dialect}`,
    async use => {
      const f = await fixture(dialect);
      try {
        await use(f.storage);
      } finally {
        await f.storage.close(context);
        await f.cleanup();
      }
    },
  );

  describe(`Knex ${dialect} durability and fencing`, () => {
    it('publishes promptly once and dispatches both entry overloads', async () => {
      const f = await fixture(dialect);
      try {
        const publish = jest.fn();
        expect(f.storage.publishing).toBeDefined();
        f.storage.publishing!(publish, context);
        expect(publish).toHaveBeenCalledTimes(1);
        await Promise.resolve();
        expect(publish).toHaveBeenCalledTimes(1);

        const id = await f.storage.mintId<EntryId>();
        expect(
          await f.storage.commit(
            [
              [
                { type: 'conversation', value: { id: ROOT_CONVERSATION_ID } },
                {
                  type: 'entry',
                  value: {
                    id,
                    conversationId: ROOT_CONVERSATION_ID,
                    kind: 'message',
                  },
                },
              ],
            ],
            () => {},
            context,
          ),
        ).toEqual({ stored: 1 });
        expect((await f.storage.entry(id, context))?.entry.id).toBe(id);
        expect(
          (await f.storage.entry(ROOT_CONVERSATION_ID, id, context))?.entry.id,
        ).toBe(id);
        const entryWithoutContext = f.storage.entry as unknown as (
          conversationId: ConversationId,
          entryId: EntryId,
          missing: undefined,
        ) => Promise<unknown>;
        await expect(
          entryWithoutContext.call(
            f.storage,
            ROOT_CONVERSATION_ID,
            id,
            undefined,
          ),
        ).rejects.toThrow('Context is required');
      } finally {
        await f.storage.close(context);
        await f.cleanup();
      }
    });

    it('continues equivalent reordered nested filters after reopen', async () => {
      const f = await fixture(dialect);
      try {
        const first = await f.storage.mintId<DocumentId>();
        const second = await f.storage.mintId<DocumentId>();
        const scope = {
          kind: 'conversation' as const,
          conversationId: ROOT_CONVERSATION_ID,
        };
        expect(
          await f.storage.commit(
            [
              [
                { type: 'conversation', value: { id: ROOT_CONVERSATION_ID } },
                ...[first, second].map((id, index) => ({
                  type: 'document.create' as const,
                  record: {
                    id,
                    kind: 'doc',
                    key: String(index),
                    scope,
                    history: 'rewindable' as const,
                    fork: 'asOf' as const,
                  },
                  content: {
                    kind: 'base' as const,
                    version: 1,
                    value: { index },
                  },
                })),
              ],
            ],
            () => {},
            context,
          ),
        ).toEqual({ stored: 1 });
        const page = await f.storage.scanDocuments(
          { scope, at: 'current', kind: 'doc' },
          1,
          undefined,
          context,
        );
        expect(page.items.map(item => item.id)).toEqual([first]);
        expect(page.next).toBeDefined();
        await f.storage.close(context);
        const reopened = await createKnexStorage({
          db: f.db,
          namespace,
          fence,
        });
        try {
          const query = {
            kind: 'doc',
            at: 'current' as const,
            scope: {
              conversationId: ROOT_CONVERSATION_ID,
              kind: 'conversation' as const,
            },
          };
          expect(
            (
              await reopened.scanDocuments(query, 1, page.next, context)
            ).items.map(item => item.id),
          ).toEqual([second]);
          await expect(
            reopened.scanDocuments(
              { ...query, kind: 'other' },
              1,
              page.next,
              context,
            ),
          ).rejects.toThrow('cursor');
        } finally {
          await reopened.close(context);
        }
      } finally {
        await f.storage.close(context);
        await f.cleanup();
      }
    });

    it('survives reopen and close leaves the shared pool open', async () => {
      const f = await fixture(dialect);
      try {
        const id = await f.storage.mintId<EntryId>();
        await f.storage.commit(
          [
            [
              { type: 'conversation', value: { id: ROOT_CONVERSATION_ID } },
              {
                type: 'entry',
                value: {
                  id,
                  conversationId: ROOT_CONVERSATION_ID,
                  kind: 'message',
                },
              },
            ],
          ],
          () => {},
          context,
        );
        const minted = await f.storage.mintId();
        await f.storage.close(context);
        await expect(f.storage.mintId()).rejects.toThrow('closed');
        await expect(
          f.db('ai_storage_commits').count('* as count'),
        ).resolves.toHaveLength(1);
        const config = f.db.client.config;
        await f.db.destroy();
        const freshDb = knex(config);
        try {
          const reopened = await createKnexStorage({
            db: freshDb,
            namespace,
            fence,
          });
          expect((await reopened.entry(id, context))?.entry.id).toBe(id);
          expect(await reopened.mintId()).toBeGreaterThan(minted);
          await reopened.close(context);
        } finally {
          await freshDb.destroy();
        }
      } finally {
        await f.cleanup();
      }
    });

    if (dialect === 'sqlite')
      it('compares TEXT lease expirations against the SQLite clock', async () => {
        const f = await fixture(dialect);
        const futureNamespace = { ...namespace, sessionId: 'text-future' };
        const pastNamespace = { ...namespace, sessionId: 'text-past' };
        try {
          await f.db('ai_namespace_leases').insert([
            {
              plugin_id: namespace.pluginId,
              session_id: futureNamespace.sessionId,
              owner_id: fence.owner,
              token: fence.token,
              expires_at: f.db.raw(
                "strftime('%Y-%m-%d %H:%M:%f', 'now', '+1 minute')",
              ),
            },
            {
              plugin_id: namespace.pluginId,
              session_id: pastNamespace.sessionId,
              owner_id: fence.owner,
              token: fence.token,
              expires_at: f.db.raw(
                "strftime('%Y-%m-%d %H:%M:%f', 'now', '-1 minute')",
              ),
            },
          ]);
          const rows = await f
            .db('ai_namespace_leases')
            .whereIn('session_id', [
              futureNamespace.sessionId,
              pastNamespace.sessionId,
            ])
            .select(f.db.raw('typeof(expires_at) AS type'));
          expect(rows.map(row => row.type)).toEqual(['text', 'text']);
          const future = await createKnexStorage({
            db: f.db,
            namespace: futureNamespace,
            fence: { ...fence, namespace: futureNamespace },
          });
          const past = await createKnexStorage({
            db: f.db,
            namespace: pastNamespace,
            fence: { ...fence, namespace: pastNamespace },
          });
          try {
            expect(await future.mintId()).toBe(2);
            await expect(past.mintId()).rejects.toThrow('fence');
          } finally {
            await future.close(context);
            await past.close(context);
          }
        } finally {
          await f.storage.close(context);
          await f.cleanup();
        }
      });

    if (dialect === 'sqlite')
      it('recovers committed state after the writer process exits', async () => {
        const f = await fixture(dialect);
        const exec = promisify(execFile);
        const moduleUrl = pathToFileURL(join(__dirname, 'knex.ts')).href;
        const prelude = `
          import knex from 'knex';
          import { BACKGROUND_CONTEXT as context } from '@earendil-works/chord/context';
          import { createKnexStorage } from ${JSON.stringify(moduleUrl)};
          const namespace = { pluginId: 'plugin', sessionId: 'session' };
          const db = knex({ client: 'better-sqlite3', connection: { filename: process.argv[1] }, useNullAsDefault: true });
          const storage = await createKnexStorage({ db, namespace, fence: { namespace, owner: 'owner', token: '1' } });
        `;
        try {
          const writer = await exec(process.execPath, [
            '--experimental-strip-types',
            '--input-type=module',
            '-e',
            `${prelude}
            const id = await storage.mintId();
            await storage.commit([[{ type: 'conversation', value: { id: 1 } }, { type: 'entry', value: { id, conversationId: 1, kind: 'message' } }]], () => {}, context);
            const minted = await storage.mintId();
            process.stdout.write(JSON.stringify({ id, minted }), () => process.exit(0));
          `,
            f.filename!,
          ]);
          const { id, minted } = JSON.parse(writer.stdout);
          const reader = await exec(process.execPath, [
            '--experimental-strip-types',
            '--input-type=module',
            '-e',
            `${prelude}
            const entry = await storage.entry(Number(process.argv[2]), context);
            const next = await storage.mintId();
            console.log(JSON.stringify({ entry, next }));
            await storage.close(context);
            await db.destroy();
          `,
            f.filename!,
            String(id),
          ]);
          const recovered = JSON.parse(reader.stdout);
          expect(recovered.entry.entry.id).toBe(id);
          expect(recovered.next).toBeGreaterThan(minted);
        } finally {
          await f.storage.close(context);
          await f.cleanup();
        }
      });

    if (dialect === 'sqlite')
      it('preserves receipts and rolls back a failed later batch', async () => {
        const f = await fixture(dialect);
        try {
          const id = await f.storage.mintId<EntryId>();
          await f.db.raw(
            "CREATE TRIGGER fail_second BEFORE INSERT ON ai_storage_commits WHEN NEW.seq = 2 BEGIN SELECT RAISE(ABORT, 'injected failure'); END",
          );
          const receipts: number[] = [];
          await expect(
            f.storage.commit(
              [
                [{ type: 'conversation', value: { id: ROOT_CONVERSATION_ID } }],
                [
                  {
                    type: 'entry',
                    value: {
                      id,
                      conversationId: ROOT_CONVERSATION_ID,
                      kind: 'message',
                    },
                  },
                ],
              ],
              index => receipts.push(index),
              context,
            ),
          ).rejects.toThrow('injected failure');
          expect(receipts).toEqual([0]);
          expect(
            await f.storage.conversation(ROOT_CONVERSATION_ID, context),
          ).toEqual({ id: ROOT_CONVERSATION_ID });
          expect(await f.storage.entry(id, context)).toBeUndefined();
          expect(
            await f.db('ai_storage_counters').where(key).first('next_seq'),
          ).toMatchObject({ next_seq: 2 });
        } finally {
          await f.storage.close(context);
          await f.cleanup();
        }
      });

    if (dialect === 'sqlite')
      it('retries a busy lock only after a confirmed rollback', async () => {
        const f = await fixture(dialect);
        try {
          await f.db.raw('PRAGMA busy_timeout = 0');
          const script = `const Database = require('better-sqlite3'); const db = new Database(process.argv[1]); db.exec('BEGIN IMMEDIATE'); console.log('locked'); setTimeout(() => { db.exec('COMMIT'); db.close(); }, 180);`;
          const child = spawn(process.execPath, ['-e', script, f.filename!], {
            stdio: ['ignore', 'pipe', 'inherit'],
          });
          const exited = once(child, 'exit');
          try {
            await once(child.stdout, 'data');
            expect(await f.storage.mintId()).toBe(2);
            await exited;
          } finally {
            child.kill();
          }
        } finally {
          await f.storage.close(context);
          await f.cleanup();
        }
      });

    it('binds cursors to the namespace, scan, filters and order', async () => {
      const f = await fixture(dialect);
      try {
        await f.storage.commit(
          [
            [{ type: 'conversation', value: { id: ROOT_CONVERSATION_ID } }],
            [
              {
                type: 'conversation',
                value: { id: 2 as typeof ROOT_CONVERSATION_ID },
              },
            ],
          ],
          () => {},
          context,
        );
        const page = await f.storage.scanConversations(
          { order: 'ascending' },
          1,
          undefined,
          context,
        );
        expect(page.next).toBeDefined();
        await expect(
          f.storage.scanTasks({}, 1, page.next, context),
        ).rejects.toThrow('cursor');
        await expect(
          f.storage.scanConversations(
            { order: 'descending' },
            1,
            page.next,
            context,
          ),
        ).rejects.toThrow('cursor');
        await expect(
          f.storage.scanConversations(
            { ownerConversationId: ROOT_CONVERSATION_ID },
            1,
            page.next,
            context,
          ),
        ).rejects.toThrow('cursor');
        const otherNamespace = { ...namespace, sessionId: 'other' };
        const other = await createKnexStorage({
          db: f.db,
          namespace: otherNamespace,
          fence: { ...fence, namespace: otherNamespace },
        });
        await expect(
          other.scanConversations({}, 1, page.next, context),
        ).rejects.toThrow('cursor');
        await other.close(context);
        expect(
          (await f.storage.scanConversations({}, 1, page.next, context))
            .items[0].id,
        ).toBe(2);
      } finally {
        await f.storage.close(context);
        await f.cleanup();
      }
    });

    it('rejects an unknown commit outcome without replaying or erasing earlier receipts', async () => {
      const f = await fixture(dialect);
      try {
        const id = await f.storage.mintId<EntryId>();
        let count = 0;
        const wrapped = ((table: string) => f.db(table)) as unknown as Knex;
        Object.defineProperty(wrapped, 'client', { value: f.db.client });
        Object.defineProperty(wrapped, 'transaction', {
          value: async () => {
            const trx = await f.db.transaction();
            if (++count === 2) {
              const commit = trx.commit.bind(trx);
              Object.defineProperty(trx, 'commit', {
                value: async () => {
                  await commit();
                  throw new Error('lost commit acknowledgement');
                },
              });
            }
            return trx;
          },
        });
        const storage = await createKnexStorage({
          db: wrapped,
          namespace,
          fence,
        });
        const receipts: number[] = [];
        await expect(
          storage.commit(
            [
              [{ type: 'conversation', value: { id: ROOT_CONVERSATION_ID } }],
              [
                {
                  type: 'entry',
                  value: {
                    id,
                    conversationId: ROOT_CONVERSATION_ID,
                    kind: 'message',
                  },
                },
              ],
            ],
            index => receipts.push(index),
            context,
          ),
        ).rejects.toThrow('lost commit acknowledgement');
        expect(receipts).toEqual([0]);
        expect(count).toBe(2);
        expect((await storage.entry(id, context))?.entry.id).toBe(id);
        await storage.close(context);
      } finally {
        await f.storage.close(context);
        await f.cleanup();
      }
    });

    it('serializes takeover against a stale writer', async () => {
      const f = await fixture(dialect);
      try {
        if (dialect === 'pg') {
          const takeover = await f.db.transaction();
          await takeover('ai_namespace_leases')
            .where(key)
            .update({ owner_id: 'new', token: 2 });
          const attempt = f.storage.mintId();
          await new Promise(resolve => setTimeout(resolve, 100));
          await takeover.commit();
          // Both dialect branches exercise the same assertion.
          // eslint-disable-next-line jest/no-conditional-expect
          await expect(attempt).rejects.toThrow('fence');
        } else {
          const script = `const Database = require('better-sqlite3'); const db = new Database(process.argv[1]); db.exec('BEGIN IMMEDIATE'); db.prepare('UPDATE ai_namespace_leases SET owner_id = ?, token = ? WHERE plugin_id = ? AND session_id = ?').run('new', 2, 'plugin', 'session'); console.log('locked'); setTimeout(() => { db.exec('COMMIT'); db.close(); }, 300);`;
          const child = spawn(process.execPath, ['-e', script, f.filename!], {
            stdio: ['ignore', 'pipe', 'inherit'],
          });
          const exited = once(child, 'exit');
          try {
            await once(child.stdout, 'data');
            // Both dialect branches exercise the same assertion.
            // eslint-disable-next-line jest/no-conditional-expect
            await expect(f.storage.mintId()).rejects.toThrow('fence');
            await exited;
          } finally {
            child.kill();
          }
        }
        expect(
          await f.db('ai_storage_counters').where(key).first(),
        ).toBeUndefined();
      } finally {
        await f.storage.close(context);
        await f.cleanup();
      }
    });

    it('checks the database clock after waiting for the lease lock', async () => {
      const f = await fixture(dialect);
      try {
        if (dialect === 'pg') {
          const holder = await f.db.transaction();
          await holder('ai_namespace_leases')
            .where(key)
            .update({
              expires_at: holder.raw(
                "statement_timestamp() + interval '500 milliseconds'",
              ),
            });
          const attempt = f.storage.mintId();
          await new Promise(resolve => setTimeout(resolve, 900));
          await holder.commit();
          // Both dialect branches exercise the same assertion.
          // eslint-disable-next-line jest/no-conditional-expect
          await expect(attempt).rejects.toThrow('fence');
        } else {
          const script = `const Database = require('better-sqlite3'); const db = new Database(process.argv[1]); db.exec("BEGIN IMMEDIATE; UPDATE ai_namespace_leases SET expires_at = (julianday('now') - 2440587.5) * 86400000 + 500"); console.log('locked'); setTimeout(() => { db.exec('COMMIT'); db.close(); }, 900);`;
          const child = spawn(process.execPath, ['-e', script, f.filename!], {
            stdio: ['ignore', 'pipe', 'inherit'],
          });
          const exited = once(child, 'exit');
          try {
            await once(child.stdout, 'data');
            // Both dialect branches exercise the same assertion.
            // eslint-disable-next-line jest/no-conditional-expect
            await expect(f.storage.mintId()).rejects.toThrow('fence');
            await exited;
          } finally {
            child.kill();
          }
        }
        expect(
          await f.db('ai_storage_counters').where(key).first(),
        ).toBeUndefined();
      } finally {
        await f.storage.close(context);
        await f.cleanup();
      }
    });

    it('rejects an expired or replaced fence using the database clock', async () => {
      const f = await fixture(dialect);
      try {
        const id = await f.storage.mintId<EntryId>();
        await f
          .db('ai_namespace_leases')
          .where(key)
          .update({ expires_at: leaseTime(f.db, dialect, -60) });
        await expect(f.storage.mintId()).rejects.toThrow('fence');
        await expect(
          f.storage.commit(
            [
              [
                {
                  type: 'entry',
                  value: {
                    id,
                    conversationId: ROOT_CONVERSATION_ID,
                    kind: 'message',
                  },
                },
              ],
            ],
            () => {},
            context,
          ),
        ).rejects.toThrow('fence');
        await f
          .db('ai_namespace_leases')
          .where(key)
          .update({
            owner_id: 'new',
            token: 2,
            expires_at: leaseTime(f.db, dialect, 60),
          });
        await expect(f.storage.mintId()).rejects.toThrow('fence');
        expect(await f.storage.entry(id, context)).toBeUndefined();
      } finally {
        await f.storage.close(context);
        await f.cleanup();
      }
    });
  });
}

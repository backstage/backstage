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
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:http';
import knex, { type Knex } from 'knex';
import { mockCredentials } from '@backstage/backend-test-utils';
import { createAttemptJournal } from '../journal/knex';
import { createModelOperationGuard } from './createModelOperationGuard';
import type { TrustedOperation } from './types';

const storageMigration = require('../../migrations/1000_storage');
const journalMigration = require('../../migrations/4000_journal');

const namespace = { pluginId: 'test', sessionId: 'session' };
const fence = { namespace, owner: 'owner', token: '1' };
const key = { plugin_id: namespace.pluginId, session_id: namespace.sessionId };
const credentials = mockCredentials.user('user:default/alice');
const pgUrl = process.env.AI_TEST_POSTGRES_URL;
const worker = process.env.AI_GUARD_CRASH_WORKER === '1';

function operation(destination: string): TrustedOperation {
  return {
    actor: 'user:default/alice',
    credentials,
    provenance: {
      origin: 'verified',
      conversationId: '1',
      taskId: '2',
      callId: '3',
    },
    fence,
    definitionVersion: 'v1',
    configVersion: 'v1',
    provider: 'openai',
    modelId: 'gpt',
    resolvedModel: 'gpt',
    operation: 'stream',
    api: 'openai-responses',
    destination,
    credentialScope: { kind: 'user', id: 'user:default/alice' },
    credentialGeneration: '1',
    controller: new AbortController(),
  };
}

function request(
  guard: ReturnType<ReturnType<typeof createModelOperationGuard>['bind']>,
  destination: string,
) {
  return guard.fetch(destination, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{"model":"gpt"}',
  });
}

function journal(db: Knex) {
  return createAttemptJournal({
    db,
    authorizer: { authorizeAuditRead: async () => true },
  });
}

async function fixture(dialect: 'sqlite' | 'pg') {
  const dir = await mkdtemp(join(tmpdir(), 'ai-guard-journal-'));
  const filename = join(dir, 'journal.sqlite');
  const schema = `ai_guard_${randomUUID().replace(/-/g, '')}`;
  const admin =
    dialect === 'pg' ? knex({ client: 'pg', connection: pgUrl }) : undefined;
  if (admin) await admin.schema.createSchema(schema);
  const db = knex(
    dialect === 'sqlite'
      ? {
          client: 'better-sqlite3',
          connection: { filename },
          useNullAsDefault: true,
          pool: { min: 1, max: 1 },
        }
      : { client: 'pg', connection: pgUrl, searchPath: [schema] },
  );
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
  return {
    db,
    filename,
    cleanup: async () => {
      await db.destroy();
      if (admin) {
        await admin.schema.dropSchema(schema, true);
        await admin.destroy();
      }
      await rm(dir, { recursive: true, force: true });
    },
  };
}

if (worker) {
  // The parent kills this worker after observing its outbound request.
  // eslint-disable-next-line jest/expect-expect
  it('worker dispatches through a real journal before its process is killed', async () => {
    const db = knex({
      client: 'better-sqlite3',
      connection: { filename: process.env.AI_GUARD_DB! },
      useNullAsDefault: true,
    });
    try {
      const destination = process.env.AI_GUARD_DESTINATION!;
      const guard = createModelOperationGuard({
        journal: journal(db),
        recheck: async () => true,
        transport: globalThis.fetch,
      }).bind(operation(destination));
      await request(guard, destination);
    } finally {
      await db.destroy();
    }
  }, 30000);
} else {
  for (const dialect of [
    'sqlite',
    ...(pgUrl ? ['pg' as const] : []),
  ] as const) {
    it(`persists revocation and expired-credential denials without secrets (${dialect})`, async () => {
      const f = await fixture(dialect);
      try {
        const j = journal(f.db);
        const destination = 'https://provider.example/v1/responses';
        const transport = jest.fn(
          async () => new Response('retry', { status: 429 }),
        );
        const recheck = jest
          .fn()
          .mockResolvedValueOnce(true)
          .mockResolvedValueOnce(false);
        const guard = createModelOperationGuard({
          journal: j,
          recheck,
          transport: transport as unknown as typeof fetch,
        }).bind(operation(destination));
        await (await request(guard, destination)).text();
        await expect(request(guard, destination)).rejects.toThrow('revoked');
        await expect(request(guard, destination)).rejects.toThrow('blocked');
        const expired = createModelOperationGuard({
          journal: j,
          recheck,
          transport: transport as unknown as typeof fetch,
        }).bind({ ...operation(destination), providerCredentialExpiresAt: 1 });
        await expect(request(expired, destination)).rejects.toThrow(
          'credential expired',
        );
        expect(transport).toHaveBeenCalledTimes(1);
        const page = await j.read(credentials, namespace);
        expect(page.items).toHaveLength(4);
        expect(page.items[0]).toMatchObject({
          decision: 'allow',
          attempt: 1,
          outcomeStatus: 'failed',
        });
        expect(page.items[1]).toMatchObject({
          kind: 'outcome',
          status: 'failed',
          httpStatus: 429,
        });
        expect(page.items[2]).toMatchObject({
          decision: 'deny',
          operation: 'models.stream',
          attempt: 2,
        });
        expect(page.items[3]).toMatchObject({
          decision: 'deny',
          operation: 'auth.token',
          reason: 'credential expired; re-authentication required',
        });
        expect(JSON.stringify(page)).not.toContain('{"model":"gpt"}');
      } finally {
        await f.cleanup();
      }
    });

    it(`enforces real fenced journal decisions and failure before send (${dialect})`, async () => {
      const f = await fixture(dialect);
      try {
        const j = journal(f.db);
        const transport = jest.fn(async () => new Response('ok'));
        const destination = 'https://provider.example/v1/responses';
        const op = operation(destination);
        const guard = createModelOperationGuard({
          journal: j,
          recheck: async () => true,
          transport: transport as unknown as typeof fetch,
        }).bind(op);
        expect(await (await request(guard, destination)).text()).toBe('ok');
        await guard.finish('completed');
        const page = await j.read(credentials, namespace);
        expect(page.items.map(e => e.kind)).toEqual(['decision', 'outcome']);
        expect(page.items[0]).toMatchObject({
          operation: 'models.stream',
          decision: 'allow',
          outcomeStatus: 'completed',
          destination,
        });
        expect(page.items[1]).toMatchObject({
          status: 'completed',
          httpStatus: 200,
        });
        const stale = createModelOperationGuard({
          journal: j,
          transport: transport as unknown as typeof fetch,
          recheck: async () => {
            await f
              .db('ai_namespace_leases')
              .where(key)
              .update({ owner_id: 'new-owner', token: 2 });
            return true;
          },
        }).bind(operation(destination));
        await expect(request(stale, destination)).rejects.toThrow(/fence/i);
        await expect(request(stale, destination)).rejects.toThrow('blocked');
        expect(transport).toHaveBeenCalledTimes(1);
        expect(await f.db('ai_journal_events').select('id')).toHaveLength(2);
        await f
          .db('ai_namespace_leases')
          .where(key)
          .update({ owner_id: fence.owner, token: fence.token });
        await f.db.schema.dropTable('ai_journal_events');
        const failed = createModelOperationGuard({
          journal: j,
          recheck: async () => true,
          transport: transport as unknown as typeof fetch,
        }).bind(operation(destination));
        await expect(request(failed, destination)).rejects.toThrow();
        await expect(request(failed, destination)).rejects.toThrow('blocked');
        expect(transport).toHaveBeenCalledTimes(1);
      } finally {
        await f.cleanup();
      }
    });
  }

  it('survives process death after intent and actual send with an unknown outcome', async () => {
    const f = await fixture('sqlite');
    const server = createServer();
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('No port');
    const child = spawn(
      'yarn',
      [
        'test',
        'packages/ai-node/src/guard/journalIntegration.test.ts',
        '--runInBand',
      ],
      {
        cwd: process.cwd(),
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          CI: '1',
          AI_GUARD_CRASH_WORKER: '1',
          AI_GUARD_DB: f.filename,
          AI_GUARD_DESTINATION: `http://127.0.0.1:${address.port}/v1/responses`,
        },
      },
    );
    let output = '';
    child.stdout.on('data', chunk => {
      output += chunk;
    });
    child.stderr.on('data', chunk => {
      output += chunk;
    });
    const exited = once(child, 'exit');
    try {
      await Promise.race([
        once(server, 'request'),
        exited.then(() => {
          throw new Error(`worker exited before send: ${output}`);
        }),
        new Promise((_, reject) => {
          setTimeout(
            () => reject(new Error(`worker timed out: ${output}`)),
            20000,
          ).unref();
        }),
      ]);
      process.kill(-child.pid!, 'SIGKILL');
      await exited;
      const page = await journal(f.db).read(credentials, namespace);
      expect(page.items).toHaveLength(1);
      expect(page.items[0]).toMatchObject({
        kind: 'decision',
        decision: 'allow',
        outcomeStatus: 'unknown',
      });
      expect(
        await f.db('ai_journal_events').where({ kind: 'outcome' }),
      ).toEqual([]);
    } finally {
      try {
        process.kill(-child.pid!, 'SIGKILL');
      } catch {
        /* already exited */
      }
      server.closeAllConnections();
      await new Promise<void>(resolve => server.close(() => resolve()));
      await f.cleanup();
    }
  }, 30000);
}

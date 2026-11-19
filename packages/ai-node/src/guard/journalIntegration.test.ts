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
import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:http';
import knex, { type Knex } from 'knex';
import { mockCredentials } from '@backstage/backend-test-utils';
import { openaiProvider } from '@earendil-works/pi-ai/providers/openai';
import { anthropicProvider } from '@earendil-works/pi-ai/providers/anthropic';
import { openaiCodexProvider } from '@earendil-works/pi-ai/providers/openai-codex';
import { azureProvider } from '@earendil-works/pi-ai/providers/azure';
import { normalizeContext } from '@earendil-works/pi-ai/utils/transcript';
import { streamSimple as openaiStream } from '@earendil-works/pi-ai/api/openai-responses';
import { streamSimple as completionsStream } from '@earendil-works/pi-ai/api/openai-completions';
import { streamSimple as anthropicStream } from '@earendil-works/pi-ai/api/anthropic-messages';
import { streamSimple as codexStream } from '@earendil-works/pi-ai/api/openai-codex-responses';
import { streamSimple as azureStream } from '@earendil-works/pi-ai/api/azure-openai-responses';
import { createAttemptJournal as createAttemptJournalBase } from '../journal/knex';
import { createModelOperationGuard as createModelOperationGuardBase } from './createModelOperationGuard';
import {
  createGuardedModelOperations as createGuardedModelOperationsBase,
  GuardedResolutionError,
} from './modelOperations';
import type { TrustedOperation } from './types';
import { builtinProviderRegistry } from '@backstage/ai-node-test-utils/alpha';
import { testTransport } from '@backstage/ai-node-test-utils/alpha';

const createAttemptJournal = (
  options: Parameters<typeof createAttemptJournalBase>[0],
) =>
  createAttemptJournalBase({ providers: builtinProviderRegistry, ...options });
const createModelOperationGuard = (
  options: Parameters<typeof createModelOperationGuardBase>[0],
) =>
  createModelOperationGuardBase({
    providers: builtinProviderRegistry,
    ...options,
  });
const createGuardedModelOperations = (
  options: Parameters<typeof createGuardedModelOperationsBase>[0],
) =>
  createGuardedModelOperationsBase({
    providers: builtinProviderRegistry,
    ...options,
  });

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
    it(`journals real SDK requests on the approved provider routes (${dialect})`, async () => {
      const f = await fixture(dialect);
      const paths: string[] = [];
      const server = createServer((req, res) => {
        paths.push(req.url ?? '');
        req.resume();
        res.writeHead(400, { 'content-type': 'application/json' });
        res.end(
          JSON.stringify({
            type: 'error',
            error: { type: 'invalid_request_error', message: 'test rejection' },
          }),
        );
      });
      server.listen(0, '127.0.0.1');
      await once(server, 'listening');
      try {
        const address = server.address();
        if (!address || typeof address === 'string')
          throw new Error('No test port');
        const base = `http://127.0.0.1:${address.port}`;
        const j = journal(f.db);
        const cases = [
          {
            model: {
              ...openaiProvider().getModels()[0],
              baseUrl: `${base}/v1`,
            },
            stream: openaiStream,
            path: '/v1/responses',
          },
          {
            model: {
              ...openaiProvider().getModels()[0],
              api: 'openai-completions' as const,
              baseUrl: `${base}/v1`,
            },
            stream: completionsStream,
            path: '/v1/chat/completions',
          },
          {
            model: { ...anthropicProvider().getModels()[0], baseUrl: base },
            stream: anthropicStream,
            path: '/v1/messages',
          },
          {
            model: {
              ...openaiCodexProvider().getModels()[0],
              baseUrl: `${base}/backend-api`,
            },
            stream: codexStream,
            path: '/backend-api/codex/responses',
          },
          {
            model: {
              ...azureProvider().getModels()[0],
              baseUrl: `${base}/openai/v1`,
            },
            stream: azureStream,
            path: '/openai/v1/responses?api-version=v1',
          },
        ];
        for (const c of cases) {
          const op: TrustedOperation = {
            ...operation(`${base}${c.path}`),
            provider: c.model.provider,
            modelId: c.model.id,
            resolvedModel: c.model.id,
            api: c.model.api as TrustedOperation['api'],
            operation: 'streamSimple',
          };
          const guard = createModelOperationGuard({
            journal: j,
            transport: globalThis.fetch,
            recheck: async () => true,
          }).bind(op);
          const apiKey =
            c.model.api === 'openai-codex-responses'
              ? `x.${Buffer.from(
                  JSON.stringify({
                    'https://api.openai.com/auth': {
                      chatgpt_account_id: 'account',
                    },
                  }),
                ).toString('base64url')}.x`
              : 'test-key';
          const result = await c
            .stream(c.model as never, normalizeContext({ messages: [] }), {
              apiKey,
              transport: 'sse',
              fetch: guard.fetch,
              maxRetries: 0,
            })
            .result();
          expect(result.stopReason).toBe('error');
          await guard.finish('failed');
        }
        const page = await j.read(credentials, namespace);
        const decisions = page.items.filter(event => event.kind === 'decision');
        expect(decisions.map(event => event.destination)).toEqual(
          cases.map(c => `${base}${c.path.split('?')[0]}`),
        );
        expect(decisions.map(event => event.outcomeStatus)).toEqual(
          cases.map(() => 'failed'),
        );
        expect(paths.map(path => path.split('?')[0])).toEqual(
          cases.map(c => c.path.split('?')[0]),
        );
        expect(JSON.stringify(page)).not.toContain('test-key');
      } finally {
        server.close();
        await once(server, 'close');
        await f.cleanup();
      }
    });

    it(`stores the Azure deployment destination as a digest (${dialect})`, async () => {
      const f = await fixture(dialect);
      try {
        const j = journal(f.db);
        const name = 'private-deployment';
        const destination = `https://provider.example/openai/deployments/${name}/responses?api-version=v1`;
        const op = {
          ...operation(destination),
          api: 'azure-openai-responses' as const,
        };
        const guard = createModelOperationGuard({
          journal: j,
          recheck: async () => true,
          transport: (async () =>
            new Response('rejected', { status: 400 })) as typeof fetch,
        }).bind(op);
        await (await request(guard, destination)).text();
        const page = await j.read(credentials, namespace);
        const digest = createHash('sha256')
          .update(name)
          .digest('hex')
          .slice(0, 16);
        expect(page.items[0]).toMatchObject({
          kind: 'decision',
          destination: `https://provider.example/openai/deployments/{deployment=${digest}}/responses`,
          outcomeStatus: 'failed',
        });
        expect(JSON.stringify(page)).not.toContain(name);
        expect(JSON.stringify(page)).not.toContain('api-version');
      } finally {
        await f.cleanup();
      }
    });

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
          transport: testTransport(transport),
        }).bind(operation(destination));
        await (await request(guard, destination)).text();
        await expect(request(guard, destination)).rejects.toThrow('revoked');
        await expect(request(guard, destination)).rejects.toThrow('blocked');
        const expired = createModelOperationGuard({
          journal: j,
          recheck,
          transport: testTransport(transport),
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
          destination: undefined,
        });
        expect(JSON.stringify(page)).not.toContain('{"model":"gpt"}');
        const clock = jest.spyOn(Date, 'now').mockReturnValue(100);
        try {
          const expiresDuringCheck = createModelOperationGuard({
            journal: j,
            recheck: async () => {
              clock.mockReturnValue(102);
              return true;
            },
            transport: testTransport(transport),
          }).bind({
            ...operation(destination),
            providerCredentialExpiresAt: 101,
          });
          await expect(
            request(expiresDuringCheck, destination),
          ).rejects.toThrow('credential expired');
          const updated = await j.read(credentials, namespace);
          expect(updated.items.at(-1)).toMatchObject({
            operation: 'auth.token',
            decision: 'deny',
            destination: undefined,
            reason: 'credential expired; re-authentication required',
          });
          expect(transport).toHaveBeenCalledTimes(1);
        } finally {
          clock.mockRestore();
        }
      } finally {
        await f.cleanup();
      }
    });

    it(`records redacted typed resolution denials in the real journal (${dialect})`, async () => {
      const f = await fixture(dialect);
      try {
        const j = journal(f.db);
        const model = openaiProvider().getModels()[0];
        const transport = jest.fn(async () => new Response('unexpected'));
        let reason = 'model is unavailable';
        const facade = createGuardedModelOperations({
          journal: j,
          guard: createModelOperationGuard({
            journal: j,
            recheck: async () => true,
            transport: testTransport(transport),
          }),
          resolve: (_model, method) => {
            throw new GuardedResolutionError(
              {
                operation: {
                  ...operation('https://provider.example/v1/responses'),
                  provider: model.provider,
                  modelId: model.id,
                  resolvedModel: model.id,
                  operation: method,
                },
                model,
                authority: { kind: 'apiKey', apiKey: 'key' },
              },
              reason,
            );
          },
        });
        await expect(facade.fetchDeferred(model, {} as never)).rejects.toThrow(
          'model is unavailable',
        );
        reason = 'token=secretvalue';
        await expect(facade.fetchDeferred(model, {} as never)).rejects.toThrow(
          'unsupported operation',
        );
        const page = await j.read(credentials, namespace);
        expect(page.items).toHaveLength(2);
        expect(page.items[0]).toMatchObject({
          operation: 'models.fetchDeferred',
          decision: 'deny',
          reason: 'model is unavailable',
        });
        expect(page.items[1]).toMatchObject({
          operation: 'models.fetchDeferred',
          decision: 'deny',
          reason: 'unsupported operation',
        });
        expect(JSON.stringify(page)).not.toContain('secretvalue');
        expect(transport).not.toHaveBeenCalled();
      } finally {
        await f.cleanup();
      }
    });

    it(`persists cancellation after committed intent and before send (${dialect})`, async () => {
      const f = await fixture(dialect);
      try {
        const j = journal(f.db);
        const destination = 'https://provider.example/v1/responses';
        const op = operation(destination);
        const transport = jest.fn(async () => new Response('unexpected'));
        const guard = createModelOperationGuard({
          journal: {
            recordDecisionAndIntent: async (fenceArg, event) => {
              const id = await j.recordDecisionAndIntent(fenceArg, event);
              op.controller.abort();
              return id;
            },
            recordOutcome: j.recordOutcome.bind(j),
            recordRecovery: j.recordRecovery.bind(j),
            read: j.read.bind(j),
          },
          recheck: async () => true,
          transport: testTransport(transport),
        }).bind(op);
        await expect(request(guard, destination)).rejects.toThrow(
          'revoked before send',
        );
        expect(transport).not.toHaveBeenCalled();
        const page = await j.read(credentials, namespace);
        expect(page.items).toHaveLength(2);
        expect(page.items[0]).toMatchObject({
          kind: 'decision',
          decision: 'allow',
          outcomeStatus: 'cancelled',
        });
        expect(page.items[1]).toMatchObject({
          kind: 'outcome',
          status: 'cancelled',
        });
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
          transport: testTransport(transport),
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
          transport: testTransport(transport),
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
          transport: testTransport(transport),
        }).bind(operation(destination));
        // Jest's isError is realm-sensitive: better-sqlite3 builds its
        // SqliteError constructor once per addon binding, so this raw driver
        // rejection — the journal write itself failing on the dropped table —
        // is not `instanceof Error` when delivered from a reused worker's
        // foreign realm, and a bare .rejects.toThrow reported a false
        // negative. Match the error's shape instead of its prototype.
        const expectedJournalFailure =
          dialect === 'sqlite' ? { code: 'SQLITE_ERROR' } : { code: '42P01' };
        await expect(request(failed, destination)).rejects.toMatchObject({
          ...expectedJournalFailure,
          message: expect.stringContaining('ai_journal_events'),
        });
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

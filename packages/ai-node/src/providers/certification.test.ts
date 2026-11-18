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

import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import knex from 'knex';
import { mockCredentials } from '@backstage/backend-test-utils';
import { createAttemptJournal } from '../journal/knex';
import { createModelOperationGuard } from '../guard/createModelOperationGuard';
import type { TrustedOperation } from '../guard/types';
import { builtinProviderModules } from '../modules';
import {
  registerProviderCertification,
  createProviderRegistry,
} from '@backstage/ai-node/testUtils';
import { validateHttpEnvelope } from './httpEnvelope';

const storageMigration = require('../../migrations/1000_storage');
const journalMigration = require('../../migrations/4000_journal');

const namespace = { pluginId: 'test', sessionId: 'session' };
const fence = { namespace, owner: 'owner', token: '1' };
const credentials = mockCredentials.user('user:default/alice');
// Every provider family's certification lives in its own package; the
// synthetic classifier below certifies the harness itself.
const paths = {
  'test-classifier': '/v1/classify',
};
const providers = createProviderRegistry([
  ...builtinProviderModules,
  {
    id: 'test-classifier',
    certifiedOperations: ['classify'],
    destinationTemplates: [[{ literal: '/v1/classify' }]],
    destination: () => 'https://provider.example/v1/classify',
    validateEnvelope: (op, req) =>
      validateHttpEnvelope({ endpoint: '/classify' }, op, req),
    adapter: {
      kind: 'custom',
      invoke: async () => {
        throw new Error('not used by this transport fixture');
      },
    },
  },
]);

type Id = keyof typeof paths;
function operation(id: Id, origin: string): TrustedOperation {
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
    provider: id,
    modelId: 'gpt',
    resolvedModel: 'gpt',
    operation: 'classify',
    api: id,
    destination: `${origin}${paths[id]}`,
    credentialScope: { kind: 'user', id: 'user:default/alice' },
    credentialGeneration: '1',
    controller: new AbortController(),
  };
}
function request(
  op: TrustedOperation,
  substitute = false,
  substituteQuery = false,
): Request {
  const url = new URL(op.destination);
  if (substituteQuery) url.searchParams.set('unexpected', 'true');
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ model: substitute ? 'other' : op.resolvedModel }),
  });
}
function journal(db: ReturnType<typeof knex>) {
  return createAttemptJournal({
    db,
    providers,
    authorizer: { authorizeAuditRead: async () => true },
  });
}

if (process.env.AI_PROVIDER_CERT_WORKER === '1') {
  // eslint-disable-next-line jest/expect-expect
  it('sends after durable intent and waits to be killed', async () => {
    const db = knex({
      client: 'better-sqlite3',
      connection: { filename: process.env.AI_PROVIDER_CERT_DB! },
      useNullAsDefault: true,
    });
    try {
      const id = process.env.AI_PROVIDER_CERT_ID as Id;
      const origin = process.env.AI_PROVIDER_CERT_ORIGIN!;
      const op = operation(id, origin);
      const guard = createModelOperationGuard({
        providers,
        journal: journal(db),
        recheck: async () => true,
        transport: globalThis.fetch,
      }).bind(op);
      await guard.fetch(request(op));
    } finally {
      await db.destroy();
    }
  }, 30000);
} else {
  const assertCrashUnknown = async (id: Id) => {
    const dir = await mkdtemp(join(tmpdir(), 'provider-cert-'));
    const filename = join(dir, 'journal.sqlite');
    const db = knex({
      client: 'better-sqlite3',
      connection: { filename },
      useNullAsDefault: true,
      pool: { min: 1, max: 1 },
    });
    await storageMigration.up(db);
    await journalMigration.up(db);
    await db('ai_namespace_leases').insert({
      plugin_id: namespace.pluginId,
      session_id: namespace.sessionId,
      owner_id: fence.owner,
      token: fence.token,
      expires_at: db.raw("(julianday('now') - 2440587.5) * 86400000 + 60000"),
    });
    const server = createServer();
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address();
    if (!address || typeof address === 'string')
      throw new Error('No test port');
    const child = spawn(
      'yarn',
      [
        'test',
        'packages/ai-node/src/providers/certification.test.ts',
        '--runInBand',
      ],
      {
        cwd: process.cwd(),
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          CI: '1',
          AI_PROVIDER_CERT_WORKER: '1',
          AI_PROVIDER_CERT_DB: filename,
          AI_PROVIDER_CERT_ID: id,
          AI_PROVIDER_CERT_ORIGIN: `http://127.0.0.1:${address.port}`,
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
      const page = await journal(db).read(credentials, namespace);
      expect(page.items).toHaveLength(1);
      expect(page.items[0]).toMatchObject({
        kind: 'decision',
        decision: 'allow',
        outcomeStatus: 'unknown',
      });
      expect(await db('ai_journal_events').where({ kind: 'outcome' })).toEqual(
        [],
      );
    } finally {
      try {
        process.kill(-child.pid!, 'SIGKILL');
      } catch {
        /* already exited */
      }
      server.closeAllConnections();
      await new Promise<void>(resolve => server.close(() => resolve()));
      await db.destroy();
      await rm(dir, { recursive: true, force: true });
    }
  };
  for (const id of Object.keys(paths) as Id[]) {
    registerProviderCertification({
      name: id,
      operation: 'classify',
      providers,
      createOperation: () => operation(id, 'https://provider.example'),
      request,
      assertCrashUnknown: () => assertCrashUnknown(id),
    });
  }
}

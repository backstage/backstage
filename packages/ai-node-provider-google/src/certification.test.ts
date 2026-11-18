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

/*
 * Copyright 2026 The Backstage Authors.
 *
 * Transitional test-only relative imports into @backstage/ai-node source:
 * P2b moves the guard/journal test machinery into
 * @backstage/ai-node/testUtils, at which point these switch to it.
 */
/* eslint-disable @backstage/no-relative-monorepo-imports -- see above */

import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import knex from 'knex';
import { mockCredentials } from '@backstage/backend-test-utils';
import { googleProvider } from '@earendil-works/pi-ai/providers/google';
import { googleVertexProvider } from '@earendil-works/pi-ai/providers/google-vertex';
import { normalizeContext } from '@earendil-works/pi-ai/utils/transcript';
import { createAttemptJournal } from '../../ai-node/src/journal/knex';
// Transitional test-only import: P2b moves this machinery into
// @backstage/ai-node/testUtils.
import { createModelOperationGuard } from '../../ai-node/src/guard/createModelOperationGuard';
import type { TrustedOperation } from '@backstage/ai-node/testUtils';
import { registerProviderCertification } from '@backstage/ai-node/testUtils';
import { createProviderRegistry } from '@backstage/ai-node/testUtils';
import { googleGenerativeAi, googleVertex } from './module';
import { closeGoogleWorker } from './runtime';

const storageMigration = require('../../ai-node/migrations/1000_storage');
const journalMigration = require('../../ai-node/migrations/4000_journal');

const namespace = { pluginId: 'test', sessionId: 'session' };
const fence = { namespace, owner: 'owner', token: '1' };
const credentials = mockCredentials.user('user:default/alice');
const providers = createProviderRegistry([googleGenerativeAi, googleVertex]);

type Id = 'google-generative-ai' | 'google-vertex';

const models: Record<Id, (origin: string) => Record<string, unknown>> = {
  'google-generative-ai': origin => ({
    ...googleProvider().getModels()[0],
    baseUrl: `${origin}/v1beta`,
  }),
  'google-vertex': origin => ({
    ...googleVertexProvider().getModels()[0],
    baseUrl: `${origin}/v1`,
  }),
};

function operation(id: Id, origin: string): TrustedOperation {
  const model = models[id](origin) as {
    id: string;
    provider: string;
  };
  const module = providers.get(id)!;
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
    provider: model.provider,
    modelId: model.id,
    resolvedModel: model.id,
    operation: 'streamSimple',
    api: id,
    destination: module.destination(model as never, undefined),
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
  if (substitute) {
    url.pathname = url.pathname.replace(
      `/models/${op.modelId}:`,
      '/models/other-model:',
    );
  }
  if (substituteQuery) url.searchParams.set('unexpected', 'true');
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{"contents":[]}',
  });
}

function journal(db: ReturnType<typeof knex>) {
  return createAttemptJournal({
    db,
    providers,
    authorizer: { authorizeAuditRead: async () => true },
  });
}

if (process.env.AI_GOOGLE_CERT_WORKER === '1') {
  // eslint-disable-next-line jest/expect-expect
  it('sends after durable intent through the worker and waits to be killed', async () => {
    const db = knex({
      client: 'better-sqlite3',
      connection: { filename: process.env.AI_GOOGLE_CERT_DB! },
      useNullAsDefault: true,
    });
    try {
      const id = process.env.AI_GOOGLE_CERT_ID as Id;
      const origin = process.env.AI_GOOGLE_CERT_ORIGIN!;
      const op = operation(id, origin);
      const guard = createModelOperationGuard({
        providers,
        journal: journal(db),
        recheck: async () => true,
        transport: globalThis.fetch,
      }).bind(op);
      const module = providers.get(id)!;
      if (module.adapter.kind !== 'stream')
        throw new Error('Expected pinned stream adapter');
      const model = models[id](origin);
      await module.adapter
        .streamSimple(
          model as never,
          normalizeContext({
            messages: [
              {
                role: 'user',
                content: [{ type: 'text', text: 'hi' }],
                timestamp: Date.now(),
              },
            ],
          }) as never,
          {
            apiKey: 'test-key',
            fetch: guard.fetch,
            maxRetries: 0,
          } as never,
        )
        .result();
    } finally {
      await db.destroy();
    }
  }, 30000);
} else {
  const assertCrashUnknown = async (id: Id) => {
    const dir = await mkdtemp(join(tmpdir(), 'google-cert-'));
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
        'packages/ai-node-provider-google/src/certification.test.ts',
        '--runInBand',
      ],
      {
        cwd: process.cwd(),
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          CI: '1',
          AI_GOOGLE_CERT_WORKER: '1',
          AI_GOOGLE_CERT_DB: filename,
          AI_GOOGLE_CERT_ID: id,
          AI_GOOGLE_CERT_ORIGIN: `http://127.0.0.1:${address.port}`,
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

  afterAll(async () => {
    await closeGoogleWorker();
  });

  for (const id of ['google-generative-ai', 'google-vertex'] as const) {
    registerProviderCertification({
      name: id,
      operation: 'streamSimple',
      providers,
      createOperation: () => operation(id, 'https://provider.example'),
      request,
      assertCrashUnknown: () => assertCrashUnknown(id),
    });
  }
}

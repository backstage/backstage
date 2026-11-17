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
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import knex from 'knex';
import { mockCredentials } from '@backstage/backend-test-utils';
import { OPENAI_CLASSIFIER_MODELS } from '@earendil-works/pi-ai/providers/openai.models';
import { OPENROUTER_IMAGE_MODELS } from '@earendil-works/pi-ai/providers/openrouter.models';
import { TYPESAFE_CLASSIFIER_MODELS } from '@earendil-works/pi-ai/providers/typesafe.models';
import type { AnyModel } from '@earendil-works/pi-ai';
import { createAttemptJournal } from '../journal/knex';
import { createModelOperationGuard } from '../guard/createModelOperationGuard';
import type { ModelOperation, TrustedOperation } from '../guard/types';
import { builtinProviderModules } from './builtins';
import { registerProviderCertification } from './certification';
import { createProviderRegistry } from './registry';

const storageMigration = require('../../migrations/1000_storage');
const journalMigration = require('../../migrations/4000_journal');

const namespace = { pluginId: 'test', sessionId: 'session' };
const fence = { namespace, owner: 'owner', token: '1' };
const credentials = mockCredentials.user('user:default/alice');

const classifierContext = {
  state: { text: 'hello' },
  questions: {
    q1: {
      type: 'bool' as const,
      instructions: 'Is this a greeting?',
      criteria: { true: 'it greets', false: 'it does not' },
    },
  },
};
const imagesContext = {
  input: [{ type: 'text' as const, text: 'a red circle on white canvas' }],
};

/**
 * The non-chat certification matrix: every module gets the full
 * registerProviderCertification discipline (ordinals, envelope validation,
 * recheck, journal-before-send, latch, crash) for its operation kind.
 */
const certified = {
  'typesafe-system-one': {
    operation: 'classify',
    model: () => TYPESAFE_CLASSIFIER_MODELS['jev-latest'] as never as AnyModel,
    context: classifierContext,
  },
  'openai-decisions': {
    operation: 'classify',
    model: () => OPENAI_CLASSIFIER_MODELS['gpt-6-luna'] as never as AnyModel,
    context: classifierContext,
  },
  'openrouter-images': {
    operation: 'generateImages',
    model: () =>
      OPENROUTER_IMAGE_MODELS[
        'black-forest-labs/flux-3-image'
      ] as never as AnyModel,
    context: imagesContext,
  },
} as const;

type Id = keyof typeof certified;
const providers = createProviderRegistry(builtinProviderModules);

function operation(id: Id, origin: string): TrustedOperation {
  const spec = certified[id];
  const model = { ...spec.model(), baseUrl: `${origin}/v1` } as AnyModel;
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
    operation: spec.operation,
    api: id,
    destination: module.destination(model, undefined),
    credentialScope: { kind: 'user', id: 'user:default/alice' },
    credentialGeneration: '1',
    controller: new AbortController(),
  };
}

function request(
  op: TrustedOperation,
  substituteModel = false,
  substituteQuery = false,
): Request {
  const url = new URL(op.destination);
  if (substituteQuery) url.searchParams.set('unexpected', 'true');
  const model = substituteModel ? 'other' : op.resolvedModel;
  const body =
    op.api === 'openrouter-images'
      ? {
          model,
          messages: [
            {
              role: 'user',
              content: [{ type: 'text', text: 'a red circle' }],
            },
          ],
          stream: false,
          modalities: ['image', 'text'],
        }
      : { model };
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function journal(db: ReturnType<typeof knex>) {
  return createAttemptJournal({
    db,
    providers,
    authorizer: { authorizeAuditRead: async () => true },
  });
}

const pgUrl = process.env.AI_TEST_POSTGRES_URL;
type Dialect = 'sqlite' | 'pg';

/** One durable journal store per dialect; the crash child reuses it by env. */
async function createStore(dialect: Dialect) {
  if (dialect === 'pg') {
    const schema = `ai_nonchat_cert_${randomUUID().replace(/-/g, '')}`;
    const admin = knex({ client: 'pg', connection: pgUrl });
    await admin.schema.createSchema(schema);
    const db = knex({ client: 'pg', connection: pgUrl, searchPath: [schema] });
    await storageMigration.up(db);
    await journalMigration.up(db);
    return {
      db,
      env: { AI_NONCHAT_CERT_SCHEMA: schema },
      expiresAt: db.raw("statement_timestamp() + interval '60 seconds'"),
      cleanup: async () => {
        await db.destroy();
        await admin.schema.dropSchema(schema, true);
        await admin.destroy();
      },
    };
  }
  const dir = await mkdtemp(join(tmpdir(), 'nonchat-cert-'));
  const filename = join(dir, 'journal.sqlite');
  const db = knex({
    client: 'better-sqlite3',
    connection: { filename },
    useNullAsDefault: true,
    pool: { min: 1, max: 1 },
  });
  await storageMigration.up(db);
  await journalMigration.up(db);
  return {
    db,
    env: { AI_NONCHAT_CERT_DB: filename },
    expiresAt: db.raw("(julianday('now') - 2440587.5) * 86400000 + 60000"),
    cleanup: async () => {
      await db.destroy();
      await rm(dir, { recursive: true, force: true });
    },
  };
}

/** The crash child's journal store, rebuilt from the inherited env. */
async function workerStore() {
  const schema = process.env.AI_NONCHAT_CERT_SCHEMA;
  if (schema) {
    const db = knex({
      client: 'pg',
      connection: process.env.AI_TEST_POSTGRES_URL,
      searchPath: [schema],
    });
    return { db, cleanup: async () => undefined };
  }
  const db = knex({
    client: 'better-sqlite3',
    connection: { filename: process.env.AI_NONCHAT_CERT_DB! },
    useNullAsDefault: true,
  });
  return { db, cleanup: async () => undefined };
}

if (process.env.AI_PROVIDER_CERT_WORKER === '1') {
  // eslint-disable-next-line jest/expect-expect
  it('sends after durable intent and waits to be killed', async () => {
    const store = await workerStore();
    try {
      const id = process.env.AI_NONCHAT_CERT_ID as Id;
      const origin = process.env.AI_NONCHAT_CERT_ORIGIN!;
      const op = operation(id, origin);
      const module = providers.get(id)!;
      const guard = createModelOperationGuard({
        providers,
        journal: journal(store.db),
        recheck: async () => true,
        transport: globalThis.fetch,
      }).bind(op);
      if (module.adapter.kind !== 'custom')
        throw new Error('Expected custom adapter');
      await module.adapter.invoke({
        operation: certified[id].operation,
        model: { ...certified[id].model(), baseUrl: `${origin}/v1` } as never,
        context: certified[id].context,
        options: {
          apiKey: 'test-key',
          fetch: guard.fetch,
          maxRetries: 0,
        } as never,
      });
    } finally {
      await store.cleanup();
      await store.db.destroy();
    }
  }, 30000);
} else {
  const assertCrashUnknownOnce = async (id: Id, dialect: Dialect) => {
    const store = await createStore(dialect);
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
        'packages/ai-node/src/providers/nonchatCertification.test.ts',
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
          AI_NONCHAT_CERT_ID: id,
          AI_NONCHAT_CERT_ORIGIN: `http://127.0.0.1:${address.port}`,
          ...store.env,
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
      await store.db('ai_namespace_leases').insert({
        plugin_id: namespace.pluginId,
        session_id: namespace.sessionId,
        owner_id: fence.owner,
        token: fence.token,
        expires_at: store.expiresAt,
      });
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
      const page = await journal(store.db).read(credentials, namespace);
      expect(page.items).toHaveLength(1);
      expect(page.items[0]).toMatchObject({
        kind: 'decision',
        decision: 'allow',
        outcomeStatus: 'unknown',
      });
      expect(
        await store.db('ai_journal_events').where({ kind: 'outcome' }),
      ).toEqual([]);
    } finally {
      try {
        process.kill(-child.pid!, 'SIGKILL');
      } catch {
        /* already exited */
      }
      server.closeAllConnections();
      await new Promise<void>(resolve => server.close(() => resolve()));
      await store.cleanup();
    }
  };
  const assertCrashUnknown = async (id: Id) => {
    for (const dialect of pgUrl
      ? (['sqlite', 'pg'] as const)
      : (['sqlite'] as const)) {
      await assertCrashUnknownOnce(id, dialect);
    }
  };
  for (const id of Object.keys(certified) as Id[]) {
    registerProviderCertification({
      name: id,
      operation: certified[id].operation as ModelOperation,
      providers,
      createOperation: () => operation(id, 'https://provider.example'),
      request,
      assertCrashUnknown: () => assertCrashUnknown(id),
    });
  }
}

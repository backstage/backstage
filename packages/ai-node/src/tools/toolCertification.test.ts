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
import { createAttemptJournal } from '../journal/knex';
import { createModelOperationGuard } from '../guard/createModelOperationGuard';
import type { ModelOperation, TrustedOperation } from '../guard/types';
import { registerProviderCertification } from '../providers/certification';
import { validateToolCallEnvelope } from './envelope';
import { createGuardedToolOperations } from './mediation';
import { createToolRegistry } from './registry';
import type { ToolModule } from './types';

const storageMigration = require('../../migrations/1000_storage');
const journalMigration = require('../../migrations/4000_journal');

const namespace = { pluginId: 'test', sessionId: 'session' };
const fence = { namespace, owner: 'owner', token: '1' };
const credentials = mockCredentials.user('user:default/alice');

function toolServerModule(origin: string): ToolModule {
  return {
    id: 'example-tools',
    tools: [
      { name: 'search', description: 'Search the index' },
      { name: 'fetch_page', description: 'Fetch one page' },
    ],
    destination: toolName => `${origin}/mcp/example-tools/tools/${toolName}`,
    destinationTemplates: [
      [
        { literal: '/mcp/' },
        { digest: 'server' },
        { literal: '/tools/' },
        { digest: 'tool' },
      ],
    ],
    validateToolCall: validateToolCallEnvelope,
    adapter: {
      kind: 'tool',
      invoke: async ({ tool, arguments: args, options }) => {
        const fetch = options.fetch as typeof globalThis.fetch;
        const headers = options.headers as Record<string, string>;
        const response = await fetch(
          `${origin}/mcp/example-tools/tools/${tool.name}`,
          {
            method: 'POST',
            headers: { 'content-type': 'application/json', ...headers },
            body: JSON.stringify({ tool: tool.name, arguments: args }),
          },
        );
        return { value: await response.json(), outcome: 'completed' };
      },
    },
  };
}

/** The tool certification matrix: one entry per certified tool server. */
const certified = {
  'example-tools': {
    module: (origin: string) => toolServerModule(origin),
    toolName: 'search',
  },
} as const;

type Id = keyof typeof certified;
const registryFor = (origin: string) =>
  createToolRegistry([certified['example-tools'].module(origin)]);

function operation(id: Id, origin: string): TrustedOperation {
  const spec = certified[id];
  const tools = registryFor(origin);
  const module = tools.resolve({
    serverId: id,
    toolName: spec.toolName,
  })!.module;
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
    modelId: spec.toolName,
    resolvedModel: spec.toolName,
    operation: 'toolCall',
    api: id,
    destination: module.destination(spec.toolName),
    credentialScope: { kind: 'user', id: 'user:default/alice' },
    credentialGeneration: '1',
    controller: new AbortController(),
  };
}

function request(
  op: TrustedOperation,
  substituteTool = false,
  substituteQuery = false,
): Request {
  const url = new URL(op.destination);
  if (substituteQuery) url.searchParams.set('unexpected', 'true');
  return new Request(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      tool: substituteTool ? 'other-tool' : op.resolvedModel,
      arguments: { query: 'x' },
    }),
  });
}

const pgUrl = process.env.AI_TEST_POSTGRES_URL;
type Dialect = 'sqlite' | 'pg';

async function createStore(dialect: Dialect) {
  if (dialect === 'pg') {
    const schema = `ai_tool_cert_${randomUUID().replace(/-/g, '')}`;
    const admin = knex({ client: 'pg', connection: pgUrl });
    await admin.schema.createSchema(schema);
    const db = knex({ client: 'pg', connection: pgUrl, searchPath: [schema] });
    await storageMigration.up(db);
    await journalMigration.up(db);
    return {
      db,
      env: { AI_TOOL_CERT_SCHEMA: schema },
      expiresAt: db.raw("statement_timestamp() + interval '60 seconds'"),
      cleanup: async () => {
        await db.destroy();
        await admin.schema.dropSchema(schema, true);
        await admin.destroy();
      },
    };
  }
  const dir = await mkdtemp(join(tmpdir(), 'tool-cert-'));
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
    env: { AI_TOOL_CERT_DB: filename },
    expiresAt: db.raw("(julianday('now') - 2440587.5) * 86400000 + 60000"),
    cleanup: async () => {
      await db.destroy();
      await rm(dir, { recursive: true, force: true });
    },
  };
}

async function workerStore() {
  const schema = process.env.AI_TOOL_CERT_SCHEMA;
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
    connection: { filename: process.env.AI_TOOL_CERT_DB! },
    useNullAsDefault: true,
  });
  return { db, cleanup: async () => undefined };
}

if (process.env.AI_TOOL_CERT_WORKER === '1') {
  // eslint-disable-next-line jest/expect-expect
  it('sends after durable intent and waits to be killed', async () => {
    const store = await workerStore();
    try {
      const id = process.env.AI_TOOL_CERT_ID as Id;
      const origin = process.env.AI_TOOL_CERT_ORIGIN!;
      const op = operation(id, origin);
      const tools = registryFor(origin);
      const journal = createAttemptJournal({
        db: store.db,
        providers: tools.providerRegistry,
        authorizer: { authorizeAuditRead: async () => true },
      });
      const mediation = createGuardedToolOperations({
        tools,
        guard: createModelOperationGuard({
          providers: tools.providerRegistry,
          journal,
          recheck: async () => true,
          transport: globalThis.fetch,
        }),
        journal,
        resolve: () => ({
          operation: op,
          authority: { headers: { authorization: 'Bearer test-key' } },
        }),
      });
      await mediation.callTool({
        serverId: id,
        toolName: certified[id].toolName,
        arguments: { query: 'x' },
        credentials,
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
        'packages/ai-node/src/tools/toolCertification.test.ts',
        '--runInBand',
      ],
      {
        cwd: process.cwd(),
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          CI: '1',
          AI_TOOL_CERT_WORKER: '1',
          AI_TOOL_CERT_ID: id,
          AI_TOOL_CERT_ORIGIN: `http://127.0.0.1:${address.port}`,
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
      const tools = registryFor(`http://127.0.0.1:${address.port}`);
      const journal = createAttemptJournal({
        db: store.db,
        providers: tools.providerRegistry,
        authorizer: { authorizeAuditRead: async () => true },
      });
      const page = await journal.read(credentials, namespace);
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
    const tools = registryFor('https://provider.example');
    registerProviderCertification({
      name: id,
      operation: 'toolCall' as ModelOperation,
      providers: tools.providerRegistry,
      createOperation: () => operation(id, 'https://provider.example'),
      request,
      assertCrashUnknown: () => assertCrashUnknown(id),
    });
  }
}

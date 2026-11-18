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
import { createServer, type Server } from 'node:http';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import knex, { type Knex } from 'knex';
import { ConfigReader } from '@backstage/config';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import type {
  AuthService,
  BackstageCredentials,
  DatabaseService,
  LifecycleService,
  PermissionsService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import {
  createAssistantMessageEventStream,
  type AnyModel,
  type AssistantMessage,
} from '@earendil-works/pi-ai';
import { createRegistry } from '@earendil-works/pi-durable';
import { configureAiInstallation } from '../../config-extension/configureAiInstallation';
import { createAttemptJournal } from '../../journal/knex';
import {
  DefaultAiService,
  type DefaultAiServiceDeps,
} from '../../DefaultAiService';
import {
  createAiServiceIntegration,
  type CredentialRefreshHook,
} from '../../integration';
import { runAiMigrations } from '../../migrations';
import { createProviderRegistry } from '../registry';
import type { AiProviderModule } from '../types';
import { createAuthOperationGuard } from './guard';
import { formAuthModule } from './formModuleFixture';
import { jsonAuthModule } from './jsonModuleFixture';
import { createAuthModuleRegistry } from './modules';

/** Core registry: remaining built-ins plus the local fixture modules. */
const jsonAuthModules = createAuthModuleRegistry([
  jsonAuthModule,
  formAuthModule,
]);

import { createAuthOperations } from './operations';

const pgUrl = process.env.AI_TEST_POSTGRES_URL;

const OLD_ACCESS = 'access-secret-before-refresh';
const OLD_REFRESH = 'refresh-secret-before-refresh';
const NEW_ACCESS = 'access-secret-after-refresh';
const NEW_REFRESH = 'refresh-secret-after-refresh';

const pluginId = 'test-plugin';

/**
 * A minimal certified stream adapter: it sends exactly one request through the
 * guarded transport and completes. It exists so the generation-level path can
 * be asserted without a provider SDK.
 */
function probeAdapter(record: (headers: Headers) => void): AiProviderModule {
  const message = (model: AnyModel): AssistantMessage => ({
    role: 'assistant',
    content: [{ type: 'text', text: 'ok' }],
    api: model.api as AssistantMessage['api'],
    provider: model.provider,
    model: model.id,
    usage: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      totalTokens: 0,
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
    },
    stopReason: 'stop',
    timestamp: Date.now(),
  });
  const stream = (
    model: AnyModel,
    _context: unknown,
    options: Record<string, unknown>,
  ) => {
    const output = createAssistantMessageEventStream();
    void (async () => {
      const fetchImpl = options.fetch as typeof fetch;
      const headers = new Headers(
        (options.headers as Record<string, string> | undefined) ?? {},
      );
      if (typeof options.apiKey === 'string' && options.apiKey.length > 0) {
        headers.set('authorization', `Bearer ${options.apiKey}`);
      }
      record(headers);
      const response = await fetchImpl(`${model.baseUrl}/complete`, {
        method: 'POST',
        headers,
        body: '{}',
      });
      await response.text();
      const result = message(model);
      output.push({ type: 'done', reason: 'stop', message: result });
      output.end();
    })().catch(error => {
      output.push({
        type: 'error',
        reason: 'error',
        error: {
          ...message({} as AnyModel),
          stopReason: 'error',
          errorMessage: String(error),
        },
      });
      output.end();
    });
    return output;
  };
  return {
    id: 'tauth-probe',
    adapter: { kind: 'stream', stream, streamSimple: stream },
    credentialKinds: ['api_key', 'oauth'],
    certifiedOperations: [
      'stream',
      'complete',
      'streamSimple',
      'completeSimple',
    ],
    destinationTemplates: [[{ literal: '/v1/complete' }]],
    destination: model => `${model.baseUrl.replace(/\/+$/, '')}/complete`,
    validateEnvelope: async () => 'model',
  };
}

type Probe = {
  endpoint: string;
  requests: Array<{ headers: Record<string, unknown>; body: string }>;
  respondWith(status: number, body: unknown): void;
  close(): Promise<void>;
};

async function probeServer(path: string): Promise<Probe> {
  const requests: Probe['requests'] = [];
  let response = { status: 200, body: {} as unknown };
  const server: Server = createServer((req, res) => {
    let body = '';
    req.on('data', chunk => {
      body += String(chunk);
    });
    req.on('end', () => {
      requests.push({ headers: { ...req.headers }, body });
      res.writeHead(response.status, { 'content-type': 'application/json' });
      res.end(JSON.stringify(response.body));
    });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = (server.address() as { port: number }).port;
  return {
    endpoint: `http://127.0.0.1:${port}${path}`,
    requests,
    respondWith(status, body) {
      response = { status, body };
    },
    close: async () => {
      server.closeAllConnections();
      server.close();
    },
  };
}

type Fixture = {
  db: Knex;
  deps: DefaultAiServiceDeps;
  handles: Array<{ release(): Promise<void> }>;
  cleanup(): Promise<void>;
};

async function fixture(dialect: 'sqlite' | 'pg'): Promise<Fixture> {
  let db: Knex;
  let cleanup: () => Promise<void>;
  if (dialect === 'sqlite') {
    const dir = await mkdtemp(join(tmpdir(), 'ai-tauth-e2e-'));
    db = knex({
      client: 'better-sqlite3',
      connection: { filename: join(dir, 'e2e.sqlite') },
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
    const schema = `ai_tauth_${randomUUID().replace(/-/g, '')}`;
    await admin.schema.createSchema(schema);
    db = knex({ client: 'pg', connection: pgUrl, searchPath: [schema] });
    cleanup = async () => {
      await db.destroy();
      await admin.schema.dropSchema(schema, true);
      await admin.destroy();
    };
  }
  await runAiMigrations({
    database: { getClient: async () => db },
    logger: mockServices.logger.mock(),
  });
  const deps: DefaultAiServiceDeps = {
    database: { getClient: async () => db } as DatabaseService,
    auth: {
      isPrincipal: (
        credentials: BackstageCredentials,
        type: 'user' | 'service',
      ) => (credentials.principal as { type: string }).type === type,
    } as unknown as AuthService,
    permissions: {
      authorize: jest.fn(async () => [{ result: 'ALLOW' }]),
      authorizeConditional: jest.fn(async () => [{ result: 'ALLOW' }]),
    } as unknown as PermissionsService,
    logger: mockServices.logger.mock(),
    auditor: mockServices.auditor.mock(),
    lifecycle: { addShutdownHook: jest.fn() } as unknown as LifecycleService,
    pluginMetadata: { getId: () => pluginId } as PluginMetadataService,
  };
  const handles: Fixture['handles'] = [];
  return {
    db,
    deps,
    handles,
    cleanup: async () => {
      for (const handle of handles.reverse()) {
        await handle.release().catch(() => {});
      }
      await cleanup();
    },
  };
}

function openOptions(sessionId: string) {
  return {
    sessionId,
    config: {
      root: new ConfigReader({
        assistant: {
          mode: 'service',
          model: { provider: 'openai', modelId: 'probe-model' },
        },
      }),
      path: 'assistant',
    },
    credentials: mockCredentials.user('user:default/alice'),
    registry: createRegistry(),
    registryVersion: 'v1',
  };
}

async function waitFor(probe: () => Promise<boolean> | boolean) {
  for (let i = 0; i < 800; i += 1) {
    if (await probe()) return;
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  throw new Error('probe timeout');
}

async function journalRows(db: Knex) {
  return db('ai_journal_events').where({ plugin_id: pluginId }).orderBy('id');
}

const engines: [string, () => Promise<Fixture>][] = [
  ['sqlite', () => fixture('sqlite')],
];
if (pgUrl) engines.push(['postgres', () => fixture('pg')]);
else {
  it.skip('PostgreSQL refresh end-to-end requires AI_TEST_POSTGRES_URL', () => {});
}

describe.each(engines)(
  '%s pre-dispatch refresh end to end',
  (_engine, make) => {
    let tokenProbe: Probe;
    let modelProbe: Probe;
    let f: Fixture;
    let sentHeaders: string[];

    beforeEach(async () => {
      f = await make();
      tokenProbe = await probeServer('/oauth/token');
      modelProbe = await probeServer('/v1/complete');
      sentHeaders = [];
    });

    afterEach(async () => {
      await tokenProbe.close();
      await modelProbe.close();
      await f.cleanup();
    });

    async function managed() {
      const configured = configureAiInstallation({
        source: {
          root: new ConfigReader({
            ai: {
              credentials: {
                encryptionKey: Buffer.alloc(32, 6).toString('base64'),
                tokenEndpoints: { openai: tokenProbe.endpoint },
              },
              models: [
                {
                  provider: 'openai',
                  modelId: 'probe-model',
                  api: 'tauth-probe',
                  baseUrl: modelProbe.endpoint.replace(
                    /\/v1\/complete$/,
                    '/v1',
                  ),
                  contextWindow: 100_000,
                  maxTokens: 4_000,
                },
              ],
            },
          }),
          path: 'ai',
        },
        db: f.db,
      });
      await configured
        .credentialStores!.forScope({ kind: 'user', id: 'user:default/alice' })
        .modify('openai', async () => ({
          type: 'oauth',
          refresh: OLD_REFRESH,
          access: OLD_ACCESS,
          expires: Date.now() + 5_000,
        }));

      const journal = createAttemptJournal({
        db: f.db,
        authorizer: { authorizeAuditRead: async () => true },
      });
      const authOperations = createAuthOperations({
        guard: createAuthOperationGuard({
          transport: fetch,
          recheck: async () => true,
          journal,
          modules: jsonAuthModules,
        }),
        journal,
        stores: configured.credentialStores!,
        modules: jsonAuthModules,
        tokenEndpoints: configured.credentialTokenEndpoints,
        clientIds: { openai: 'client-id' },
      });
      const hook: CredentialRefreshHook = async input => {
        await authOperations.refresh({
          context: {
            actor: input.actor,
            credentials: input.credentials,
            provenance: { origin: 'verified', ...input.provenance },
            fence: input.fence,
            definitionVersion: input.definitionVersion,
            configVersion: input.configVersion,
          },
          scope: input.scope,
          providerId: input.provider,
        });
      };
      const providers = createProviderRegistry([
        probeAdapter(headers => {
          sentHeaders.push(headers.get('authorization') ?? '');
        }),
      ]);
      const integration = await createAiServiceIntegration({
        deps: f.deps,
        providers,
        credentialStores: configured.credentialStores,
        models: configured.models,
        refreshExpiredCredential: hook,
      });
      return DefaultAiService.create({ deps: f.deps, integration });
    }

    it('refreshes and dispatches under the rotated credential', async () => {
      tokenProbe.respondWith(200, {
        access_token: NEW_ACCESS,
        refresh_token: NEW_REFRESH,
        expires_in: 3_600,
      });
      const service = await managed();
      const handle = await service.openHarness(openOptions('e2e-rotate'));
      f.handles.push(handle);
      const conversation = await handle.harness.root(handle.context);
      await conversation.submit(
        { type: 'input', content: 'hello' },
        handle.context,
      );

      await waitFor(() => sentHeaders.length > 0);
      await conversation.abort(handle.context);

      // The guarded model dispatch carried the rotated credential.
      expect(sentHeaders[0]).toContain(NEW_ACCESS);
      expect(sentHeaders[0]).not.toContain(OLD_ACCESS);
      expect(tokenProbe.requests).toHaveLength(1);
      expect(tokenProbe.requests[0].body).toContain(OLD_REFRESH);
      expect(modelProbe.requests).toHaveLength(1);

      const rows = await journalRows(f.db);
      const auth = rows.find(
        row => row.operation === 'auth.token' && row.decision === 'allow',
      );
      expect(auth).toMatchObject({ destination: tokenProbe.endpoint });
      expect(
        rows.find(row => row.kind === 'outcome' && row.attempt_id === auth!.id),
      ).toMatchObject({ status: 'completed', http_status: 200 });
      const model = rows.find(
        row =>
          String(row.operation).startsWith('models.') &&
          row.decision === 'allow',
      );
      expect(model).toBeDefined();
      expect(
        rows.find(
          row => row.kind === 'outcome' && row.attempt_id === model!.id,
        ),
      ).toMatchObject({ status: 'completed' });
      // Neither token value is durable.
      expect(JSON.stringify(rows)).not.toContain(NEW_ACCESS);
      expect(JSON.stringify(rows)).not.toContain(OLD_REFRESH);
    }, 30000);

    it('denies without sending when the refresh fails', async () => {
      tokenProbe.respondWith(401, { error: 'invalid_grant' });
      const service = await managed();
      const handle = await service.openHarness(openOptions('e2e-fail'));
      f.handles.push(handle);
      const conversation = await handle.harness.root(handle.context);
      await conversation.submit(
        { type: 'input', content: 'hello' },
        handle.context,
      );

      await waitFor(async () => {
        const rows = await journalRows(f.db);
        return rows.some(
          row => row.kind === 'decision' && row.decision === 'deny',
        );
      });
      await conversation.abort(handle.context);

      expect(sentHeaders).toHaveLength(0);
      expect(modelProbe.requests).toHaveLength(0);
      const rows = await journalRows(f.db);
      const denial = rows.find(
        row => row.kind === 'decision' && row.decision === 'deny',
      );
      expect(String(denial.reason)).toContain(
        'credential expired; re-authentication required',
      );
      expect(
        rows.find(
          row =>
            row.kind === 'recovery' && row.recovery_kind === 'needs-reauth',
        ),
      ).toBeDefined();
    }, 30000);
  },
);

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
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import knexFactory from 'knex';
import request from 'supertest';
import {
  mockCredentials,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import {
  coreServices,
  createServiceFactory,
  createBackendModule,
  type PermissionsService,
} from '@backstage/backend-plugin-api';
import { httpRouterServiceFactory } from '@backstage/backend-defaults/httpRouter';
import { builtinProviderModules } from '@backstage/ai-node/temporary';
import { aiServiceRef } from '@backstage/ai-node/alpha';
import type { AiService, ToolModule } from '@backstage/ai-node/alpha';
import { ConfigReader } from '@backstage/config';
import { createRegistry } from '@earendil-works/pi-durable';
import plugin from './index';
import { aiModulesExtensionPoint } from '@backstage/plugin-ai-backend/alpha';

const completions = builtinProviderModules.find(
  module => module.id === 'openai-completions',
)!;

async function database(pgUrl?: string) {
  const directory = pgUrl
    ? undefined
    : await mkdtemp(join(tmpdir(), 'ai-backend-'));
  const admin = pgUrl
    ? knexFactory({ client: 'pg', connection: pgUrl })
    : undefined;
  const schema = `be_${randomUUID().replaceAll('-', '')}`;
  if (admin) await admin.schema.createSchema(schema);
  const knex = pgUrl
    ? knexFactory({
        client: 'pg',
        connection: pgUrl,
        searchPath: [schema],
        pool: { min: 1, max: 1 },
      })
    : knexFactory({
        client: 'better-sqlite3',
        connection: { filename: join(directory!, 'db.sqlite') },
        useNullAsDefault: true,
        pool: { min: 1, max: 1 },
      });
  return {
    knex,
    async close() {
      await knex.destroy();
      if (admin) {
        await admin.schema.dropSchema(schema, true);
        await admin.destroy();
      }
      if (directory) await rm(directory, { recursive: true, force: true });
    },
  };
}

describe.each<[string, string | undefined]>([
  ['sqlite', undefined],
  ...(process.env.AI_TEST_POSTGRES_URL
    ? [['postgres', process.env.AI_TEST_POSTGRES_URL] as [string, string]]
    : []),
])('AI backend (%s)', (_dialect, pgUrl) => {
  it('streams a local provider response and exposes a journaled outcome', async () => {
    let providerRequests = 0;
    let breakStream = false;
    let failRequest = false;
    const deniedPermissions = new Set<string>();
    const permissionService = {
      authorize: async (
        requests: Parameters<PermissionsService['authorize']>[0],
      ) =>
        requests.map(({ permission }) => ({
          result: deniedPermissions.has(permission.name) ? 'DENY' : 'ALLOW',
        })),
    } as unknown as PermissionsService;
    const provider = createServer((req, res) => {
      providerRequests += 1;
      req.resume();
      if (failRequest) {
        res.writeHead(400, { 'content-type': 'application/json' });
        res.end(
          JSON.stringify({
            error: {
              message: 'private provider error',
              type: 'invalid_request_error',
            },
          }),
        );
        return;
      }
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      const chunk = (delta: object, finish: string | null) =>
        `data: ${JSON.stringify({
          id: 'test',
          object: 'chat.completion.chunk',
          created: 1,
          model: 'example',
          choices: [{ index: 0, delta, finish_reason: finish }],
        })}\n\n`;
      res.write(chunk({ role: 'assistant', content: 'Hello' }, null));
      setTimeout(() => {
        if (breakStream) res.destroy();
        else res.end(`${chunk({}, 'stop')}data: [DONE]\n\n`);
      }, 250);
    });
    provider.listen(0, '127.0.0.1');
    await once(provider, 'listening');
    const port = (provider.address() as { port: number }).port;
    const db = await database(pgUrl);
    const { knex } = db;
    const providerModule = createBackendModule({
      pluginId: 'ai',
      moduleId: 'test-provider',
      register(env) {
        env.registerInit({
          deps: { modules: aiModulesExtensionPoint, ai: aiServiceRef },
          async init({ modules, ai }) {
            const early = await ai.openHarness({
              sessionId: 'before-registration',
              config: {
                root: new ConfigReader({
                  assistant: {
                    mode: 'service',
                    model: { provider: 'openai', modelId: 'example' },
                  },
                }),
                path: 'assistant',
              },
              credentials: mockCredentials.user('user:default/alice'),
              registry: createRegistry(),
              registryVersion: 'v1',
            });
            try {
              const conversation = await early.harness.root(early.context);
              await conversation.submit(
                { type: 'input', content: 'before registration' },
                early.context,
              );
              let reasons: Array<{ reason: string }> = [];
              for (let i = 0; i < 100 && reasons.length === 0; i += 1) {
                reasons = await knex('ai_journal_events')
                  .where({
                    session_id: 'before-registration',
                    decision: 'deny',
                  })
                  .select('reason');
                if (!reasons.length)
                  await new Promise(resolve => setTimeout(resolve, 20));
              }
              expect(
                reasons.some(row =>
                  row.reason.includes('aiModulesExtensionPoint'),
                ),
              ).toBe(true);
              expect(providerRequests).toBe(0);
              await conversation.abort(early.context);
            } finally {
              await early.release();
            }
            expect(() =>
              modules.registerProviderModules([completions]),
            ).toThrow();
            modules.registerProviderModules([
              { ...completions, id: 'registered-completions' },
            ]);
          },
        });
      },
    });
    const data = {
      ai: {
        models: [
          {
            provider: 'openai',
            modelId: 'example',
            api: 'registered-completions',
            baseUrl: `http://127.0.0.1:${port}/v1`,
            contextWindow: 10000,
            maxTokens: 1000,
          },
        ],
        credentials: {
          encryptionKey: Buffer.alloc(32, 9).toString('base64'),
          scopes: { org: { openai: { type: 'api_key', key: 'test-key' } } },
        },
      },
    };
    const backend = await startTestBackend({
      features: [
        plugin,
        providerModule,
        httpRouterServiceFactory,
        mockServices.database.factory({ knex }),
        mockServices.rootConfig.factory({ data }),
        createServiceFactory({
          service: coreServices.permissions,
          deps: {},
          factory: async () => permissionService,
        }),
        mockServices.httpAuth.factory({
          defaultCredentials: mockCredentials.none(),
        }),
      ],
    });
    try {
      const alice = mockCredentials.user.token('user:default/alice');
      const created = await request(backend.server)
        .post('/api/ai/v1/sessions')
        .auth(alice, { type: 'bearer' })
        .send({ model: { provider: 'openai', modelId: 'example' } });
      expect(created.status).toBe(201);
      const session = created.body.sessionId;
      const result = await request(backend.server)
        .post(
          `/api/ai/v1/sessions/${session}/conversations/${created.body.conversationId}/messages`,
        )
        .auth(alice, { type: 'bearer' })
        .send({ content: 'hello' });
      expect(result.status).toBe(200);
      expect(result.text).toContain('event: partial');
      expect(result.text).toContain('event: answer');
      expect(result.text).toContain('Hello');
      const history = await request(backend.server)
        .get(
          `/api/ai/v1/sessions/${session}/conversations/${created.body.conversationId}`,
        )
        .auth(alice, { type: 'bearer' });
      expect(history.status).toBe(200);
      expect(history.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ role: 'assistant', content: 'Hello' }),
        ]),
      );
      const audit = await request(backend.server)
        .get(`/api/ai/v1/sessions/${session}/audit`)
        .auth(alice, { type: 'bearer' });
      expect(audit.status).toBe(200);
      expect(audit.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ kind: 'outcome', status: 'completed' }),
        ]),
      );
      expect(JSON.stringify(audit.body)).not.toContain('test-key');

      const second = await request(backend.server)
        .post('/api/ai/v1/sessions')
        .auth(alice, { type: 'bearer' })
        .send({ model: { provider: 'openai', modelId: 'example' } });
      const httpPort = (backend.server.address() as { port: number }).port;
      const response = await fetch(
        `http://127.0.0.1:${httpPort}/api/ai/v1/sessions/${second.body.sessionId}/conversations/${second.body.conversationId}/messages`,
        {
          method: 'POST',
          headers: {
            authorization: `Bearer ${alice}`,
            'content-type': 'application/json',
          },
          body: JSON.stringify({ content: 'disconnect' }),
        },
      );
      expect(response.status).toBe(200);
      const reader = response.body!.getReader();
      await reader.read();
      await reader.cancel();
      let observed = false;
      for (let i = 0; i < 100 && !observed; i += 1) {
        const page = await request(backend.server)
          .get(`/api/ai/v1/sessions/${second.body.sessionId}/audit`)
          .auth(alice, { type: 'bearer' });
        observed =
          page.body.items?.some(
            (item: { kind: string; status: string }) =>
              item.kind === 'outcome' && item.status === 'completed',
          ) ?? false;
        if (!observed) await new Promise(resolve => setTimeout(resolve, 30));
      }
      expect(observed).toBe(true);

      breakStream = true;
      const broken = await request(backend.server)
        .post('/api/ai/v1/sessions')
        .auth(alice, { type: 'bearer' })
        .send({ model: { provider: 'openai', modelId: 'example' } });
      const brokenResponse = await request(backend.server)
        .post(
          `/api/ai/v1/sessions/${broken.body.sessionId}/conversations/${broken.body.conversationId}/messages`,
        )
        .auth(alice, { type: 'bearer' })
        .send({ content: 'broken stream' });
      expect(brokenResponse.text).toContain('unanswered');
      const brokenAudit = await request(backend.server)
        .get(`/api/ai/v1/sessions/${broken.body.sessionId}/audit`)
        .auth(alice, { type: 'bearer' });
      expect(brokenAudit.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ kind: 'outcome', status: 'stream-failed' }),
        ]),
      );
      breakStream = false;
      failRequest = true;
      const failed = await request(backend.server)
        .post('/api/ai/v1/sessions')
        .auth(alice, { type: 'bearer' })
        .send({ model: { provider: 'openai', modelId: 'example' } });
      const failedResponse = await request(backend.server)
        .post(
          `/api/ai/v1/sessions/${failed.body.sessionId}/conversations/${failed.body.conversationId}/messages`,
        )
        .auth(alice, { type: 'bearer' })
        .send({ content: 'failure' });
      expect(failedResponse.text).toContain('unanswered');
      expect(failedResponse.text).not.toContain('private provider error');
      const failedAudit = await request(backend.server)
        .get(`/api/ai/v1/sessions/${failed.body.sessionId}/audit`)
        .auth(alice, { type: 'bearer' });
      expect(failedAudit.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ kind: 'outcome', status: 'failed' }),
        ]),
      );
      failRequest = false;

      const third = await request(backend.server)
        .post('/api/ai/v1/sessions')
        .auth(alice, { type: 'bearer' })
        .send({ model: { provider: 'openai', modelId: 'example' } });
      const before = providerRequests;
      deniedPermissions.add('ai.model.openai.example.use');
      const denial = await request(backend.server)
        .post(
          `/api/ai/v1/sessions/${third.body.sessionId}/conversations/${third.body.conversationId}/messages`,
        )
        .auth(alice, { type: 'bearer' })
        .send({ content: 'denied' });
      expect(denial.status).toBe(200);
      expect(denial.text).toContain('unanswered');
      expect(providerRequests).toBe(before);
      const denialAudit = await request(backend.server)
        .get(`/api/ai/v1/sessions/${third.body.sessionId}/audit`)
        .auth(alice, { type: 'bearer' });
      expect(denialAudit.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ kind: 'decision', decision: 'deny' }),
        ]),
      );
      deniedPermissions.add('ai.audit.read');
      expect(
        (
          await request(backend.server)
            .get(`/api/ai/v1/sessions/${third.body.sessionId}/audit`)
            .auth(alice, { type: 'bearer' })
        ).status,
      ).toBe(403);
      const routes = [
        ['get', '/api/ai/v1/models'],
        ['get', '/api/ai/v1/sessions'],
        ['post', '/api/ai/v1/sessions'],
        ['get', `/api/ai/v1/sessions/${third.body.sessionId}`],
        ['post', `/api/ai/v1/sessions/${third.body.sessionId}/conversations`],
        [
          'get',
          `/api/ai/v1/sessions/${third.body.sessionId}/conversations/${third.body.conversationId}`,
        ],
        [
          'post',
          `/api/ai/v1/sessions/${third.body.sessionId}/conversations/${third.body.conversationId}/messages`,
        ],
        ['get', `/api/ai/v1/sessions/${third.body.sessionId}/audit`],
      ] as const;
      for (const [method, path] of routes) {
        expect((await request(backend.server)[method](path)).status).toBe(401);
      }
      const bob = mockCredentials.user.token('user:default/bob');
      for (const [method, path] of routes.slice(3)) {
        expect(
          (
            await request(backend.server)
              [method](path)
              .auth(bob, { type: 'bearer' })
          ).status,
        ).toBe(path.endsWith('/audit') ? 403 : 404);
      }
      deniedPermissions.add('ai.session.use');
      for (const [method, path] of routes) {
        expect(
          (
            await request(backend.server)
              [method](path)
              .auth(alice, { type: 'bearer' })
          ).status,
        ).toBe(403);
      }
      expect(
        (
          await request(backend.server)
            .get('/api/ai/v1/models')
            .auth(alice, { type: 'bearer' })
        ).status,
      ).toBe(403);
      expect(
        (
          await request(backend.server)
            .get('/api/ai/v1/sessions')
            .auth(alice, { type: 'bearer' })
        ).status,
      ).toBe(403);
      expect(
        (
          await request(backend.server)
            .post('/api/ai/v1/sessions')
            .auth(alice, { type: 'bearer' })
            .send({ model: { provider: 'openai', modelId: 'example' } })
        ).status,
      ).toBe(403);
    } finally {
      await backend.stop();
      await db.close();
      provider.closeAllConnections();
      provider.close();
    }
  }, 20000);
  it('registers a tool module through the backend extension point', async () => {
    const requests: Array<{ authorization?: string; body: string }> = [];
    const server = createServer((req, res) => {
      const chunks: Buffer[] = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => {
        requests.push({
          authorization: req.headers.authorization,
          body: Buffer.concat(chunks).toString(),
        });
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ result: 'registered-tool' }));
      });
    });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const origin = `http://127.0.0.1:${
      (server.address() as { port: number }).port
    }`;
    const tool: ToolModule = {
      id: 'registered-tools',
      tools: [{ name: 'search' }],
      destination: name => `${origin}/mcp/registered-tools/tools/${name}`,
      destinationTemplates: [
        [
          { literal: '/mcp/' },
          { digest: 'server' },
          { literal: '/tools/' },
          { digest: 'tool' },
        ],
      ],
      async validateToolCall(operation, toolRequest) {
        const body = await toolRequest.json();
        if (
          toolRequest.url !== operation.destination ||
          toolRequest.method !== 'POST' ||
          body.tool !== operation.toolName ||
          typeof body.arguments !== 'object' ||
          !body.arguments
        ) {
          throw new Error('Invalid tool request');
        }
      },
      adapter: {
        kind: 'tool',
        async invoke({ tool: declaration, arguments: args, options }) {
          const response = await (options.fetch as typeof fetch)(
            `${origin}/mcp/registered-tools/tools/${declaration.name}`,
            {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                ...(options.headers as Record<string, string>),
              },
              body: JSON.stringify({ tool: declaration.name, arguments: args }),
            },
          );
          return { value: await response.json(), outcome: 'completed' };
        },
      },
    };
    const db = await database(pgUrl);
    let service: AiService | undefined;
    const dynamic = createBackendModule({
      pluginId: 'ai',
      moduleId: 'test-tool',
      register(env) {
        env.registerInit({
          deps: { modules: aiModulesExtensionPoint, ai: aiServiceRef },
          async init({ modules, ai }) {
            modules.registerToolModules([tool]);
            service = ai;
          },
        });
      },
    });
    const backend = await startTestBackend({
      features: [
        plugin,
        dynamic,
        mockServices.database.factory({ knex: db.knex }),
        mockServices.rootConfig.factory({
          data: {
            ai: {
              credentials: {
                encryptionKey: Buffer.alloc(32, 9).toString('base64'),
                scopes: {
                  org: {
                    'mcp:registered-tools': {
                      type: 'api_key',
                      key: 'tool-key',
                    },
                  },
                },
              },
            },
          },
        }),
        mockServices.permissions.factory({ result: 'ALLOW' }),
      ],
    });
    try {
      const credentials = mockCredentials.user('user:default/alice');
      const handle = await service!.openHarness({
        sessionId: 'tool-session',
        config: {
          root: new ConfigReader({ assistant: { mode: 'interactive' } }),
          path: 'assistant',
        },
        credentials,
        registry: createRegistry(),
        registryVersion: 'v1',
      });
      try {
        await expect(
          handle.tools!.callTool({
            serverId: 'registered-tools',
            toolName: 'search',
            arguments: { query: 'x' },
            credentials,
          }),
        ).resolves.toEqual({ result: 'registered-tool' });
        expect(requests).toEqual([
          {
            authorization: 'Bearer tool-key',
            body: JSON.stringify({ tool: 'search', arguments: { query: 'x' } }),
          },
        ]);
        expect(
          await db
            .knex('ai_journal_events')
            .where({ session_id: 'tool-session' })
            .select('kind', 'decision', 'status'),
        ).toMatchObject([
          { kind: 'decision', decision: 'allow' },
          { kind: 'outcome', status: 'completed' },
        ]);
      } finally {
        await handle.release();
      }
    } finally {
      await backend.stop();
      await db.close();
      server.closeAllConnections();
      server.close();
    }
  }, 20000);

  it('enforces authenticated ownership through the backend wiring', async () => {
    const db = await database(pgUrl);
    const { knex } = db;
    const backend = await startTestBackend({
      features: [
        plugin,
        httpRouterServiceFactory,
        mockServices.database.factory({ knex }),
        mockServices.httpAuth.factory({
          defaultCredentials: mockCredentials.none(),
        }),
      ],
    });
    try {
      const alice = mockCredentials.user.token('user:default/alice');
      const bob = mockCredentials.user.token('user:default/bob');
      const denied = await request(backend.server).get('/api/ai/v1/sessions');
      expect(denied.status).toBe(401);
      const created = await request(backend.server)
        .post('/api/ai/v1/sessions')
        .auth(alice, { type: 'bearer' })
        .send({ model: { provider: 'openai', modelId: 'example' } });
      expect(created.status).toBe(201);
      expect(created.body).toEqual({
        sessionId: expect.any(String),
        conversationId: expect.any(Number),
      });
      const sessionId = created.body.sessionId;
      const own = await request(backend.server)
        .get('/api/ai/v1/sessions')
        .auth(alice, { type: 'bearer' });
      expect(own.body.items).toContain(sessionId);
      for (let i = 0; i < 2; i += 1) {
        const additional = await request(backend.server)
          .post('/api/ai/v1/sessions')
          .auth(alice, { type: 'bearer' })
          .send({ model: { provider: 'openai', modelId: 'example' } });
        expect(additional.status).toBe(201);
      }
      const firstPage = await request(backend.server)
        .get('/api/ai/v1/sessions?limit=1')
        .auth(alice, { type: 'bearer' });
      expect(firstPage.status).toBe(200);
      expect(firstPage.body.items).toHaveLength(1);
      expect(firstPage.body.nextCursor).toBe(firstPage.body.items[0]);
      const nextPage = await request(backend.server)
        .get('/api/ai/v1/sessions')
        .query({ limit: 1, cursor: firstPage.body.nextCursor })
        .auth(alice, { type: 'bearer' });
      expect(nextPage.body.items).toHaveLength(1);
      expect(nextPage.body.items[0]).not.toBe(firstPage.body.items[0]);
      const clamped = await request(backend.server)
        .get('/api/ai/v1/sessions?limit=501')
        .auth(alice, { type: 'bearer' });
      expect(clamped.status).toBe(200);
      expect(clamped.body.items).toHaveLength(3);
      for (const limit of ['0', '-1', 'abc', '1.5', '']) {
        const invalid = await request(backend.server)
          .get('/api/ai/v1/sessions')
          .query({ limit })
          .auth(alice, { type: 'bearer' });
        expect(invalid.status).toBe(400);
      }
      const detail = await request(backend.server)
        .get(`/api/ai/v1/sessions/${sessionId}`)
        .auth(alice, { type: 'bearer' });
      expect(detail.status).toBe(200);
      expect(detail.body).toEqual({ sessionId });
      const missing = await request(backend.server)
        .get('/api/ai/v1/sessions/not-an-existing-session')
        .auth(alice, { type: 'bearer' });
      expect(missing.status).toBe(404);
      const repeatedLimit = await request(backend.server)
        .get('/api/ai/v1/sessions?limit=1&limit=2')
        .auth(alice, { type: 'bearer' });
      expect(repeatedLimit.status).toBe(400);
      const foreign = await request(backend.server)
        .get(`/api/ai/v1/sessions/${sessionId}`)
        .auth(bob, { type: 'bearer' });
      expect(foreign.status).toBe(404);
      const audit = await request(backend.server)
        .get(`/api/ai/v1/sessions/${sessionId}/audit`)
        .auth(bob, { type: 'bearer' });
      expect(audit.status).toBe(403);
      const invalidCursor = await request(backend.server)
        .get(`/api/ai/v1/sessions/${sessionId}/audit?cursor=invalid`)
        .auth(alice, { type: 'bearer' });
      expect(invalidCursor.status).toBe(400);
      for (const cursor of ['', '-1', '01', '9223372036854775808']) {
        const invalid = await request(backend.server)
          .get(`/api/ai/v1/sessions/${sessionId}/audit`)
          .query({ cursor })
          .auth(alice, { type: 'bearer' });
        expect(invalid.status).toBe(400);
      }
      const repeatedCursor = await request(backend.server)
        .get(`/api/ai/v1/sessions/${sessionId}/audit?cursor=0&cursor=1`)
        .auth(alice, { type: 'bearer' });
      expect(repeatedCursor.status).toBe(400);
      const validCursor = await request(backend.server)
        .get(`/api/ai/v1/sessions/${sessionId}/audit?cursor=0`)
        .auth(alice, { type: 'bearer' });
      expect(validCursor.status).toBe(200);
      const maxCursor = await request(backend.server)
        .get(
          `/api/ai/v1/sessions/${sessionId}/audit?cursor=9223372036854775807`,
        )
        .auth(alice, { type: 'bearer' });
      expect(maxCursor.status).toBe(200);
      const rejected = await request(backend.server)
        .post(
          `/api/ai/v1/sessions/${sessionId}/conversations/${created.body.conversationId}/messages`,
        )
        .auth(bob, { type: 'bearer' })
        .send({ content: 'hello' });
      expect(rejected.status).toBe(404);
      const submission = await request(backend.server)
        .post(
          `/api/ai/v1/sessions/${sessionId}/conversations/${created.body.conversationId}/messages`,
        )
        .auth(alice, { type: 'bearer' })
        .send({ content: 'hello' });
      expect(submission.status).toBe(200);
      expect(submission.header['content-type']).toMatch('text/event-stream');
      expect(submission.text).toContain('event: settled');
    } finally {
      await backend.stop();
      await db.close();
    }
  });
});

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

import { once } from 'node:events';
import { mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import knex, { type Knex } from 'knex';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import type {
  AuthService,
  BackstageCredentials,
  DatabaseService,
  LifecycleService,
  PermissionsService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import { ConfigReader } from '@backstage/config';
import type { Credential, CredentialStore } from '@earendil-works/pi-ai';
import { createRegistry } from '@earendil-works/pi-durable';
import { DefaultAiService } from '../DefaultAiService';
import type { DefaultAiServiceDeps } from '../DefaultAiService';
import { createAiServiceIntegration } from '../integration';
import { runAiMigrations } from '../migrations';
import { EncryptedUserCredentialStore } from '../credentials/EncryptedUserCredentialStore';
import { mcpCredentialGeneration, mcpCredentialId } from '../credentials/mcp';
import type { AiCredentialStores, CredentialScope } from '../credentials/types';
import { validateToolCallEnvelope } from './envelope';
import type { ToolModule } from './types';

const ENCRYPTION_KEY = new Uint8Array(32).fill(7);
const credentials = mockCredentials.user('user:default/alice');
const scope: CredentialScope = { kind: 'user', id: 'user:default/alice' };

function makeDeps(
  db: Knex,
  authorize: (
    credentials: BackstageCredentials,
    name: string,
  ) => Promise<{ result: string }>,
): DefaultAiServiceDeps {
  return {
    database: { getClient: async () => db } as DatabaseService,
    auth: {
      isPrincipal: (value: BackstageCredentials, type: 'user' | 'service') =>
        (value.principal as { type: string }).type === type,
    } as unknown as AuthService,
    permissions: {
      authorize: async (
        requests: Array<{ permission: { name: string } }>,
        options: { credentials: BackstageCredentials },
      ) =>
        Promise.all(
          requests.map(request =>
            authorize(options.credentials, request.permission.name),
          ),
        ),
    } as unknown as PermissionsService,
    logger: mockServices.logger.mock(),
    auditor: mockServices.auditor.mock(),
    lifecycle: { addShutdownHook: jest.fn() } as unknown as LifecycleService,
    pluginMetadata: { getId: () => 'test-plugin' } as PluginMetadataService,
  };
}

function toolServerModule(
  origin: string,
  hooks: { rotateAfterFirstSend: () => boolean; rotate: () => Promise<void> },
): ToolModule {
  return {
    id: 'stock-tools',
    tools: [{ name: 'search', description: 'Search the index' }],
    destination: toolName => `${origin}/mcp/stock-tools/tools/${toolName}`,
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
        const headers = (options.headers ?? {}) as Record<string, string>;
        const send = () =>
          fetch(`${origin}/mcp/stock-tools/tools/${tool.name}`, {
            method: 'POST',
            headers: { 'content-type': 'application/json', ...headers },
            body: JSON.stringify({ tool: tool.name, arguments: args }),
          });
        try {
          const response = await send();
          const value = await response.json();
          if (hooks.rotateAfterFirstSend()) {
            // The credential rotates between the first send and the retry:
            // the recheck must reject the retry on the generation change.
            await hooks.rotate();
            try {
              await send();
            } catch (retryError) {
              return {
                value: { errorMessage: String(retryError) },
                outcome: 'failed',
              };
            }
          }
          return { value, outcome: 'completed' };
        } catch (error) {
          return {
            value: { errorMessage: String(error) },
            outcome: 'failed',
          };
        }
      },
    },
  };
}

describe('stock integration tool mediation', () => {
  let directory: string;
  let db: Knex;

  beforeAll(async () => {
    directory = await mkdtemp(join(tmpdir(), 'ai-node-tool-integration-'));
    db = knex({
      client: 'better-sqlite3',
      connection: { filename: join(directory, 'ai.sqlite') },
      useNullAsDefault: true,
      pool: { min: 1, max: 1 },
    });
    await runAiMigrations({
      database: { getClient: async () => db },
      logger: mockServices.logger.mock(),
    });
  });

  afterAll(async () => {
    await db.destroy();
    await rm(directory, { recursive: true, force: true });
  });

  it('mediates tool calls through the stock service with no host wiring', async () => {
    const requests: Array<{
      pathname: string;
      body: Record<string, unknown>;
      authorization?: string;
    }> = [];
    const server = createServer((req, res) => {
      const chunks: Buffer[] = [];
      req.on('data', chunk => chunks.push(chunk));
      req.on('end', () => {
        requests.push({
          pathname: req.url ?? '',
          body: JSON.parse(Buffer.concat(chunks).toString('utf-8')),
          authorization: req.headers.authorization,
        });
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ result: 'stock-tool-output' }));
      });
    });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    const origin = `http://127.0.0.1:${address.port}`;
    try {
      // The scoped MCP credential in the encrypted user store, under the
      // reserved tool-server key.
      const userStore = new EncryptedUserCredentialStore({
        db,
        encryptionKey: ENCRYPTION_KEY,
        scopeKey: 'user:user:default/alice',
      });
      const stores: AiCredentialStores = {
        forScope(forScope: CredentialScope) {
          if (forScope.kind !== 'user') {
            const empty: CredentialStore = {
              read: async () => undefined,
              list: async () => [],
              modify: async () => undefined,
              delete: async () => {},
            };
            return empty;
          }
          return userStore;
        },
      };
      await userStore.modify(
        mcpCredentialId('stock-tools'),
        async () =>
          ({
            type: 'api_key',
            key: 'stock-tool-token',
          } satisfies Credential),
      );

      let allowed = true;
      let rotateAfterFirstSend = false;
      const rotate = async () => {
        await userStore.modify(
          mcpCredentialId('stock-tools'),
          async () =>
            ({
              type: 'api_key',
              key: 'rotated-tool-token',
            } satisfies Credential),
        );
      };
      const deps = makeDeps(db, async (_credentials, name) => {
        if (name === 'ai.tool.stock-tools.search.use') {
          return { result: allowed ? 'ALLOW' : 'DENY' };
        }
        return { result: 'ALLOW' };
      });
      const integration = await createAiServiceIntegration({
        deps,
        credentialStores: stores,
        toolModules: [
          toolServerModule(origin, {
            rotateAfterFirstSend: () => rotateAfterFirstSend,
            rotate,
          }),
        ],
      });
      const service = DefaultAiService.create({ deps, integration });
      const open = async () =>
        service.openHarness({
          sessionId: 'tool-session',
          config: {
            root: new ConfigReader({ assistant: { mode: 'interactive' } }),
            path: 'assistant',
          },
          credentials,
          registry: createRegistry(),
          registryVersion: 'v1',
        });
      const handle = await open();
      expect(handle.tools).toBeDefined();

      // Scoped token, journaled, guarded: the stock path with zero
      // host-supplied resolver or recheck wiring.
      await expect(
        handle.tools!.callTool({
          serverId: 'stock-tools',
          toolName: 'search',
          arguments: { query: 'x' },
          credentials,
        }),
      ).resolves.toEqual({ result: 'stock-tool-output' });
      expect(requests).toHaveLength(1);
      expect(requests[0].pathname).toBe('/mcp/stock-tools/tools/search');
      expect(requests[0].authorization).toBe('Bearer stock-tool-token');
      expect(requests[0].body).toEqual({
        tool: 'search',
        arguments: { query: 'x' },
      });
      const events = await db('ai_journal_events')
        .orderBy('id')
        .select('kind', 'decision', 'attempt', 'status', 'operation');
      expect(events).toMatchObject([
        {
          kind: 'decision',
          decision: 'allow',
          attempt: 1,
          operation: 'models.toolCall',
        },
        { kind: 'outcome', status: 'completed' },
      ]);

      // Permission denial: the tool permission is refused before any send.
      allowed = false;
      requests.length = 0;
      await expect(
        handle.tools!.callTool({
          serverId: 'stock-tools',
          toolName: 'search',
          arguments: { query: 'x' },
          credentials,
        }),
      ).resolves.toMatchObject({
        errorMessage: expect.stringContaining('revoked'),
      });
      expect(requests).toHaveLength(0);

      // Credential rotation mid-call: the recheck re-resolves the scoped
      // MCP credential and rejects the retry when the generation changed.
      allowed = true;
      rotateAfterFirstSend = true;
      requests.length = 0;
      await expect(
        handle.tools!.callTool({
          serverId: 'stock-tools',
          toolName: 'search',
          arguments: { query: 'x' },
          credentials,
        }),
      ).resolves.toMatchObject({
        errorMessage: expect.stringContaining('revoked'),
      });
      expect(requests).toHaveLength(1);
      // The rotated credential serves the NEXT acquisition, proving the
      // recheck compared generations rather than blanket-denying.
      await handle.release();
      rotateAfterFirstSend = false;
      requests.length = 0;
      const reopened = await open();
      await expect(
        reopened.tools!.callTool({
          serverId: 'stock-tools',
          toolName: 'search',
          arguments: { query: 'x' },
          credentials,
        }),
      ).resolves.toEqual({ result: 'stock-tool-output' });
      expect(requests).toHaveLength(1);
      expect(requests[0].authorization).toBe('Bearer rotated-tool-token');
      await reopened.release();

      // The generation identity is scoped and rotation-sensitive.
      expect(mcpCredentialGeneration(scope, 'stock-tool-token')).not.toBe(
        mcpCredentialGeneration(scope, 'rotated-tool-token'),
      );
    } finally {
      server.closeAllConnections();
      await new Promise<void>(resolve => server.close(() => resolve()));
    }
  });
});

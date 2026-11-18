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
import knexFactory, { type Knex } from 'knex';
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
import { createRegistry } from '@earendil-works/pi-durable';
import type { AnyModel, Credential } from '@earendil-works/pi-ai';
import {
  DefaultAiService,
  type DefaultAiServiceDeps,
} from '../DefaultAiService';
import type { AiCredentialStores, CredentialScope } from '../credentials/types';
import { createAiServiceIntegration } from '../integration';
import { runAiMigrations } from '../migrations';
import { builtinProviderRegistry } from '../providers/testFixtures';

type Probe = {
  baseUrl: string;
  requests: Array<{ url?: string; headers: Record<string, unknown> }>;
  close(): Promise<void>;
};

async function probeServer(): Promise<Probe> {
  const requests: Probe['requests'] = [];
  const server: Server = createServer((req, res) => {
    requests.push({ url: req.url, headers: { ...req.headers } });
    req.resume();
    res.writeHead(400, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({
        error: { message: 'end test request', type: 'invalid_request_error' },
      }),
    );
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = (server.address() as { port: number }).port;
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    requests,
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
  close(): Promise<void>;
};

async function fixture(): Promise<Fixture> {
  const directory = await mkdtemp(join(tmpdir(), 'ai-node-gateway-'));
  const db = knexFactory({
    client: 'better-sqlite3',
    connection: { filename: join(directory, 'db') },
    useNullAsDefault: true,
    pool: { min: 1, max: 1 },
  });
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
    pluginMetadata: { getId: () => 'test-plugin' } as PluginMetadataService,
  };
  const handles: Fixture['handles'] = [];
  return {
    db,
    deps,
    handles,
    close: async () => {
      for (const handle of handles.reverse()) {
        await handle.release().catch(() => {});
      }
      await db.destroy();
      await rm(directory, { recursive: true, force: true });
    },
  };
}

/** A scoped-store stand-in keyed by provider id, as the stores are. */
function orgStores(
  credentials: Readonly<Record<string, Credential>>,
): AiCredentialStores {
  return {
    forScope: (scope: CredentialScope) => ({
      read: async (providerId: string) => credentials[providerId],
      list: async () => [],
      modify: async () => {
        throw new Error('read-only');
      },
      delete: async () => {
        throw new Error('read-only');
      },
      scope,
    }),
  } as unknown as AiCredentialStores;
}

function gatewayModel(options: {
  provider: string;
  api: string;
  baseUrl: string;
}): AnyModel {
  return {
    type: 'chat',
    id: 'gateway-chat',
    name: 'gateway-chat',
    provider: options.provider,
    api: options.api,
    baseUrl: options.baseUrl,
    contextWindow: 200_000,
    maxTokens: 8_000,
    input: ['text'],
    reasoning: false,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  } as unknown as AnyModel;
}

function openOptions(options: { sessionId: string; provider: string }) {
  return {
    sessionId: options.sessionId,
    config: {
      root: new ConfigReader({
        assistant: {
          mode: 'service',
          model: { provider: options.provider, modelId: 'gateway-chat' },
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
  for (let i = 0; i < 600; i += 1) {
    if (await probe()) return;
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  throw new Error('probe timeout');
}

/**
 * Custom gateways, pinned against pi's own catalog entries: the gateway is a
 * provider id of its own that reuses a certified adapter, so module resolution
 * is by `api`, credentials are scoped to the gateway's provider id, and the
 * gateway's base URL must still produce a certified route.
 */
describe('custom gateway providers', () => {
  it('dispatches a vercel-ai-gateway entry through the certified adapter', async () => {
    const f = await fixture();
    const probe = await probeServer();
    try {
      // pi catalog: provider 'vercel-ai-gateway', api 'anthropic-messages',
      // baseUrl 'https://ai-gateway.vercel.sh' (bare host, no path prefix).
      const integration = await createAiServiceIntegration({
        providers: builtinProviderRegistry,
        deps: f.deps,
        models: [
          gatewayModel({
            provider: 'vercel-ai-gateway',
            api: 'anthropic-messages',
            baseUrl: probe.baseUrl,
          }),
        ],
        credentialStores: orgStores({
          'vercel-ai-gateway': { type: 'api_key', key: 'vercel-gateway-key' },
        }),
      });
      const service = DefaultAiService.create({ deps: f.deps, integration });
      const handle = await service.openHarness(
        openOptions({
          sessionId: 'vercel-gateway',
          provider: 'vercel-ai-gateway',
        }),
      );
      f.handles.push(handle);
      const conversation = await handle.harness.root(handle.context);
      await conversation.submit(
        { type: 'input', content: 'hello gateway' },
        handle.context,
      );
      await waitFor(() => probe.requests.length > 0);
      await conversation.abort(handle.context);

      // Module resolution by api, credential by provider id, route template
      // '/v1/messages' satisfied by the gateway's host.
      // The anthropic module's federation envelope adds its SDK query
      // parameter; the PATH is what the route template certifies.
      expect(probe.requests[0].url).toBe('/v1/messages?beta=true');
      expect(
        Object.values(probe.requests[0].headers).some(value =>
          String(value).includes('vercel-gateway-key'),
        ),
      ).toBe(true);
      const events = await f
        .db('ai_journal_events')
        .orderBy('id')
        .select('kind', 'decision', 'provider', 'model', 'destination');
      expect(events[0]).toMatchObject({
        kind: 'decision',
        decision: 'allow',
        provider: 'vercel-ai-gateway',
        model: 'gateway-chat',
      });
      expect(JSON.stringify(events)).toContain('/v1/messages');
    } finally {
      await probe.close();
      await f.close();
    }
  }, 30000);

  it.each([
    // Both real catalog entries carry a path prefix, and both families
    // certify only prefix-free routes.
    [
      'cloudflare-ai-gateway',
      'anthropic-messages',
      '/v1/acct/gateway/anthropic',
      'no approved route template for destination',
    ],
    [
      'vercel-ai-gateway',
      'typesafe-system-one',
      '/typesafe/v1',
      // This family's custom adapter refuses the request shape first, so the
      // journaled reason is that refusal rather than the route check.
      'unsupported model options',
    ],
  ])(
    'denies the catalog path shape of %s (%s) that no template certifies',
    async (provider, api, pathPrefix, expectedReason) => {
      const f = await fixture();
      const probe = await probeServer();
      try {
        const integration = await createAiServiceIntegration({
          providers: builtinProviderRegistry,
          deps: f.deps,
          models: [
            gatewayModel({
              provider,
              api,
              baseUrl: `${probe.baseUrl}${pathPrefix}`,
            }),
          ],
          credentialStores: orgStores({
            [provider]: { type: 'api_key', key: 'gateway-key' },
          }),
        });
        const service = DefaultAiService.create({ deps: f.deps, integration });
        const handle = await service.openHarness(
          openOptions({ sessionId: `${provider}-prefix`, provider }),
        );
        f.handles.push(handle);
        const conversation = await handle.harness.root(handle.context);
        const submission = await conversation.submit(
          { type: 'input', content: 'hello gateway' },
          handle.context,
        );
        const settled = await submission.wait(handle.context);
        await conversation.abort(handle.context);

        // Fail closed: the prefixed path is not a certified route, so the
        // request never leaves the process — and the refusal is journaled as a
        // denial with the closed reason and the attempt's identity, like every
        // other denial before a send.
        expect(probe.requests).toEqual([]);
        expect(settled.status).not.toBe('done');
        await expect(
          f
            .db('ai_journal_events')
            .orderBy('id')
            .select('kind', 'decision', 'reason', 'provider', 'model'),
        ).resolves.toEqual([
          expect.objectContaining({
            kind: 'decision',
            decision: 'deny',
            reason: expectedReason,
            provider,
            model: 'gateway-chat',
          }),
        ]);
      } finally {
        await probe.close();
        await f.close();
      }
    },
    30000,
  );

  it('rejects a configured credential kind no registered module consumes', async () => {
    const f = await fixture();
    const probe = await probeServer();
    try {
      // The catalog serves this gateway through an API-key-only family, so an
      // `oauth` entry for it rejects at composition, before the service starts.
      await expect(
        createAiServiceIntegration({
          providers: builtinProviderRegistry,
          deps: f.deps,
          models: [
            gatewayModel({
              provider: 'my-gateway',
              api: 'typesafe-system-one',
              baseUrl: probe.baseUrl,
            }),
          ],
          credentialStores: orgStores({}),
          configCredentialKinds: [
            { scope: 'org', providerId: 'my-gateway', kind: 'oauth' },
          ],
        }),
      ).rejects.toThrow(
        "Credential configuration for provider 'my-gateway' at scope 'org' uses a 'oauth' credential, which no registered module for that provider accepts. Supported credential kinds: api_key",
      );
    } finally {
      await probe.close();
      await f.close();
    }
  }, 20000);

  it('refuses an oauth credential for a gateway family that consumes api keys', async () => {
    const f = await fixture();
    const probe = await probeServer();
    try {
      const integration = await createAiServiceIntegration({
        providers: builtinProviderRegistry,
        deps: f.deps,
        models: [
          gatewayModel({
            provider: 'my-gateway',
            api: 'typesafe-system-one',
            baseUrl: probe.baseUrl,
          }),
        ],
        credentialStores: orgStores({
          'my-gateway': {
            type: 'oauth',
            access: 'gateway-access-token',
            refresh: 'gateway-refresh-token',
            expires: Date.now() + 60_000,
          },
        }),
      });
      const service = DefaultAiService.create({ deps: f.deps, integration });
      const handle = await service.openHarness(
        openOptions({ sessionId: 'oauth-gateway', provider: 'my-gateway' }),
      );
      f.handles.push(handle);
      const conversation = await handle.harness.root(handle.context);
      const submission = await conversation.submit(
        { type: 'input', content: 'hello gateway' },
        handle.context,
      );
      const settled = await submission.wait(handle.context);
      expect(settled.status).not.toBe('done');
      expect(probe.requests).toEqual([]);
      // The denial names the supported kind, so the fix is obvious.
      const denials = await f
        .db('ai_journal_events')
        .where({ decision: 'deny' })
        .select('reason');
      expect(JSON.stringify(denials)).toContain('Supported credential kinds');
      expect(JSON.stringify(denials)).toContain('api_key');
    } finally {
      await probe.close();
      await f.close();
    }
  }, 30000);
});

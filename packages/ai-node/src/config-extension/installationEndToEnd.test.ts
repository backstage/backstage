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
import {
  DefaultAiService,
  type DefaultAiServiceDeps,
} from '../DefaultAiService';
import type { AnyModel, Credential } from '@earendil-works/pi-ai';
import type { AiCredentialStores, CredentialScope } from '../credentials/types';
import { createAiServiceIntegration } from '../integration';
import { runAiMigrations } from '../migrations';
import { configureAiInstallation } from './configureAiInstallation';

const pgUrl = process.env.AI_TEST_POSTGRES_URL;

const ORG_KEY = 'sk-configured-org-key';
const PERSONAL_KEY = 'sk-configured-personal-key';

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

async function fixture(dialectPgUrl?: string): Promise<Fixture> {
  const directory = dialectPgUrl
    ? undefined
    : await mkdtemp(join(tmpdir(), 'ai-node-t7-'));
  const admin = dialectPgUrl
    ? knexFactory({ client: 'pg', connection: dialectPgUrl })
    : undefined;
  const schema = `t7_${randomUUID().replaceAll('-', '')}`;
  if (admin) {
    await admin.schema.createSchema(schema);
  }
  const db = dialectPgUrl
    ? knexFactory({
        client: 'pg',
        connection: dialectPgUrl,
        searchPath: [schema],
        pool: { min: 1, max: 1 },
      })
    : knexFactory({
        client: 'better-sqlite3',
        connection: { filename: join(directory!, 'db') },
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
      if (admin) {
        await admin.schema.dropSchema(schema, true);
        await admin.destroy();
      }
      if (directory) {
        await rm(directory, { recursive: true, force: true });
      }
    },
  };
}

function installationConfig(options: {
  baseUrl: string;
  models?: boolean;
  credentials?: Record<string, unknown> | false;
  precedence?: 'user-first' | 'org-first';
}) {
  return new ConfigReader({
    ai: {
      ...(options.credentials === false
        ? {}
        : {
            credentials: {
              encryptionKey: Buffer.alloc(32, 9).toString('base64'),
              ...(options.precedence === undefined
                ? {}
                : { precedence: options.precedence }),
              ...options.credentials,
            },
          }),
      ...(options.models === false
        ? {}
        : {
            models: [
              {
                provider: 'openai',
                modelId: 'gpt-review',
                api: 'openai-responses',
                baseUrl: `${options.baseUrl}/v1`,
                contextWindow: 400_000,
                maxTokens: 128_000,
              },
            ],
          }),
    },
  });
}

function openOptions(
  sessionId: string,
  credentials: BackstageCredentials = mockCredentials.user(
    'user:default/alice',
  ),
) {
  return {
    sessionId,
    config: {
      root: new ConfigReader({
        assistant: {
          mode: 'service',
          model: { provider: 'openai', modelId: 'gpt-review' },
        },
      }),
      path: 'assistant',
    },
    credentials,
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

/** A canonical catalog entry pointing at the probe server. */
function catalogModel(baseUrl: string): AnyModel {
  return {
    type: 'chat',
    id: 'gpt-review',
    name: 'gpt-review',
    provider: 'openai',
    api: 'openai-responses',
    baseUrl: `${baseUrl}/v1`,
    contextWindow: 400_000,
    maxTokens: 128_000,
    input: ['text'],
    reasoning: false,
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  } as unknown as AnyModel;
}

/**
 * Observed credential-order test stand-in. Records every scope the
 * integration reads and returns a fixed credential per scope, or rejects.
 * Not production credential handling; it exists to observe the integration's
 * own resolution order and error behavior.
 */
function scopedStores(entries: Readonly<Record<string, Credential | Error>>): {
  stores: AiCredentialStores;
  reads: string[];
} {
  const reads: string[] = [];
  const keyOf = (scope: CredentialScope) =>
    scope.kind === 'org' ? 'org' : `${scope.kind}:${scope.id}`;
  return {
    reads,
    stores: {
      forScope: scope => {
        const key = keyOf(scope);
        return {
          async read() {
            reads.push(key);
            const entry = entries[key];
            if (entry instanceof Error) {
              throw entry;
            }
            return entry;
          },
          async list() {
            return [];
          },
          async modify() {
            return undefined;
          },
          async delete() {},
        };
      },
    },
  };
}

const engines: [string, (pg?: string) => Promise<Fixture>][] = [
  ['sqlite', pg => fixture(pg)],
];
if (pgUrl) {
  engines.push(['postgres', pg => fixture(pg)]);
} else {
  it.skip('PostgreSQL installation config tests require AI_TEST_POSTGRES_URL', () => {});
}

describe.each(engines)('%s installation config end to end', (_engine, make) => {
  it('dispatches to the configured model with the configured org credential', async () => {
    const f = await make(pgUrl);
    const probe = await probeServer();
    try {
      const configured = configureAiInstallation({
        source: {
          root: installationConfig({
            baseUrl: probe.baseUrl,
            credentials: {
              scopes: { org: { openai: { type: 'api_key', key: ORG_KEY } } },
            },
          }),
          path: 'ai',
        },
        db: f.db,
      });
      const integration = await createAiServiceIntegration({
        deps: f.deps,
        ...configured,
      });
      const service = DefaultAiService.create({ deps: f.deps, integration });

      const handle = await service.openHarness(openOptions('configured'));
      f.handles.push(handle);
      const conversation = await handle.harness.root(handle.context);
      await conversation.submit(
        { type: 'input', content: 'hello' },
        handle.context,
      );

      // The guarded dispatch reaches the canonical destination of the
      // configured catalog entry, carrying the configured credential.
      await waitFor(() => probe.requests.length > 0);
      await conversation.abort(handle.context);
      expect(probe.requests[0].url).toBe('/v1/responses');
      expect(
        Object.values(probe.requests[0].headers).some(value =>
          String(value).includes(ORG_KEY),
        ),
      ).toBe(true);

      // Nothing was denied for missing provider credentials.
      const denials = await f
        .db('ai_journal_events')
        .where({ session_id: 'configured', decision: 'deny' })
        .select('reason');
      expect(
        denials.some((row: { reason: string }) =>
          row.reason.includes('not configured'),
        ),
      ).toBe(false);
    } finally {
      await probe.close();
      await f.close();
    }
  }, 20000);

  it('still fails closed and journals actionably when the model has no credential', async () => {
    const f = await make(pgUrl);
    const probe = await probeServer();
    try {
      const configured = configureAiInstallation({
        source: {
          root: installationConfig({
            baseUrl: probe.baseUrl,
            // A credential for a different provider only.
            credentials: {
              scopes: {
                org: { anthropic: { type: 'api_key', key: 'sk-anthropic' } },
              },
            },
          }),
          path: 'ai',
        },
        db: f.db,
      });
      const integration = await createAiServiceIntegration({
        deps: f.deps,
        ...configured,
      });
      const service = DefaultAiService.create({ deps: f.deps, integration });

      const handle = await service.openHarness(openOptions('unconfigured'));
      f.handles.push(handle);
      const conversation = await handle.harness.root(handle.context);
      await conversation.submit(
        { type: 'input', content: 'hello' },
        handle.context,
      );

      await waitFor(async () => {
        const rows = await f
          .db('ai_journal_events')
          .where({ session_id: 'unconfigured', decision: 'deny' })
          .select('reason');
        return rows.length > 0;
      });
      await conversation.abort(handle.context);

      const rows: Array<{ reason: string }> = await f
        .db('ai_journal_events')
        .where({ session_id: 'unconfigured', decision: 'deny' })
        .select('reason');
      expect(rows.some(row => row.reason.includes('not configured'))).toBe(
        true,
      );
      // Absence never fell back to another provider's credential, so nothing
      // was sent anywhere.
      expect(probe.requests).toHaveLength(0);
    } finally {
      await probe.close();
      await f.close();
    }
  }, 20000);

  it('still fails closed when the model is not in the configured catalog', async () => {
    const f = await make(pgUrl);
    const probe = await probeServer();
    try {
      const configured = configureAiInstallation({
        source: {
          root: installationConfig({
            baseUrl: probe.baseUrl,
            models: false,
            credentials: {
              scopes: { org: { openai: { type: 'api_key', key: ORG_KEY } } },
            },
          }),
          path: 'ai',
        },
        db: f.db,
      });
      const integration = await createAiServiceIntegration({
        deps: f.deps,
        ...configured,
      });
      const service = DefaultAiService.create({ deps: f.deps, integration });

      const handle = await service.openHarness(openOptions('uncatalogued'));
      f.handles.push(handle);
      const conversation = await handle.harness.root(handle.context);
      await conversation.submit(
        { type: 'input', content: 'hello' },
        handle.context,
      );

      await waitFor(async () => {
        const rows = await f
          .db('ai_journal_events')
          .where({ session_id: 'uncatalogued', decision: 'deny' })
          .select('reason');
        return rows.some((row: { reason: string }) =>
          row.reason.includes('not in the canonical catalog'),
        );
      });
      await conversation.abort(handle.context);
      expect(probe.requests).toHaveLength(0);
    } finally {
      await probe.close();
      await f.close();
    }
  }, 20000);

  it('honors the configured user-versus-org credential precedence', async () => {
    const f = await make(pgUrl);
    const probe = await probeServer();
    try {
      const root = (precedence?: 'user-first' | 'org-first') =>
        installationConfig({
          baseUrl: probe.baseUrl,
          ...(precedence === undefined ? {} : { precedence }),
          credentials: {
            scopes: { org: { openai: { type: 'api_key', key: ORG_KEY } } },
          },
        });

      // Default (user-first): a personal credential wins when present.
      const userFirst = configureAiInstallation({
        source: { root: root(), path: 'ai' },
        db: f.db,
      });
      await userFirst
        .credentialStores!.forScope({
          kind: 'user',
          id: 'user:default/alice',
        })
        .modify('openai', async () => ({
          type: 'api_key',
          key: PERSONAL_KEY,
        }));

      const dispatch = async (
        precedence: 'user-first' | 'org-first' | undefined,
        sessionId: string,
        credentials?: BackstageCredentials,
      ) => {
        const configured = configureAiInstallation({
          source: { root: root(precedence), path: 'ai' },
          db: f.db,
        });
        const integration = await createAiServiceIntegration({
          deps: f.deps,
          ...configured,
        });
        const service = DefaultAiService.create({ deps: f.deps, integration });
        const handle = await service.openHarness(
          openOptions(sessionId, credentials),
        );
        f.handles.push(handle);
        const conversation = await handle.harness.root(handle.context);
        const before = probe.requests.length;
        await conversation.submit(
          { type: 'input', content: 'hello' },
          handle.context,
        );
        await waitFor(() => probe.requests.length > before);
        await conversation.abort(handle.context);
        return probe.requests[before];
      };

      const carried = (request: { headers: Record<string, unknown> }) =>
        Object.values(request.headers).map(String).join(' ');

      // Default (user-first): the personal credential wins when present.
      expect(carried(await dispatch(undefined, 'precedence-a'))).toContain(
        PERSONAL_KEY,
      );
      // org-first prefers the installation credential even though a personal
      // one exists.
      expect(carried(await dispatch('org-first', 'precedence-b'))).toContain(
        ORG_KEY,
      );
      // Absence falls through: another user has no personal credential, so the
      // default precedence resolves the installation's.
      const bobRequest = await dispatch(
        undefined,
        'precedence-c',
        mockCredentials.user('user:default/bob'),
      );
      expect(carried(bobRequest)).toContain(ORG_KEY);
    } finally {
      await probe.close();
      await f.close();
    }
  }, 30000);

  /**
   * Direct-integration cell: no installation config is involved, so this pins
   * the integration's own default rather than the config layer's.
   */
  it('resolves user credentials before org credentials with no explicit precedence', async () => {
    const f = await make(pgUrl);
    const probe = await probeServer();
    try {
      const { stores, reads } = scopedStores({
        'user:user:default/alice': { type: 'api_key', key: PERSONAL_KEY },
        org: { type: 'api_key', key: ORG_KEY },
      });
      const integration = await createAiServiceIntegration({
        deps: f.deps,
        credentialStores: stores,
        models: [catalogModel(probe.baseUrl)],
        // credentialPrecedence intentionally omitted: the default must be
        // user-first.
      });
      const service = DefaultAiService.create({ deps: f.deps, integration });

      const handle = await service.openHarness(openOptions('default-order'));
      f.handles.push(handle);
      // Resolution stops at the first hit, so the first read must be the
      // personal scope; flipping the default would read 'org' first and send
      // the installation credential.
      expect(reads).toEqual(['user:user:default/alice']);

      const conversation = await handle.harness.root(handle.context);
      await conversation.submit(
        { type: 'input', content: 'hello' },
        handle.context,
      );
      await waitFor(() => probe.requests.length > 0);
      await conversation.abort(handle.context);

      expect(
        Object.values(probe.requests[0].headers).some(value =>
          String(value).includes(PERSONAL_KEY),
        ),
      ).toBe(true);
    } finally {
      await probe.close();
      await f.close();
    }
  }, 20000);

  /**
   * Direct-integration cell: a failed personal read is not absence, so it must
   * never fall through to the installation credential.
   */
  it('does not fall through to org credentials when the personal read fails', async () => {
    const f = await make(pgUrl);
    const probe = await probeServer();
    try {
      const { stores, reads } = scopedStores({
        'user:user:default/alice': new Error(
          'personal credential store unavailable',
        ),
        org: { type: 'api_key', key: ORG_KEY },
      });
      const integration = await createAiServiceIntegration({
        deps: f.deps,
        credentialStores: stores,
        models: [catalogModel(probe.baseUrl)],
      });
      const service = DefaultAiService.create({ deps: f.deps, integration });

      await expect(
        service.openHarness(openOptions('read-failure')),
      ).rejects.toThrow(/personal credential store unavailable/);
      // The failure was not absorbed into a fallback, so nothing dispatched.
      expect(reads).toEqual(['user:user:default/alice']);
      expect(probe.requests).toHaveLength(0);
    } finally {
      await probe.close();
      await f.close();
    }
  }, 20000);
});

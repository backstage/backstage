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
import { randomUUID } from 'node:crypto';
import { createServer, type Server } from 'node:http';
import { once } from 'node:events';
import knex, { type Knex } from 'knex';
import { mockCredentials } from '@backstage/backend-test-utils';
import type { OAuthCredential } from '@earendil-works/pi-ai';
import { createCredentialStores } from '../../credentials/createCredentialStores';
import type {
  AiCredentialStores,
  CredentialScope,
} from '../../credentials/types';
import { createAttemptJournal } from '../../journal/knex';
import type { AttemptJournal } from '../../journal/types';
import { createAuthOperationGuard, type AuthModuleLookup } from './guard';
import { AuthTokenRejection } from './guard';
import { builtinAuthModules, createAuthModuleRegistry } from './modules';
import { formAuthModule } from './formModuleFixture';
import { jsonAuthModule } from './jsonModuleFixture';

/** Core registry: the remaining built-ins plus the local JSON-bodied module. */
const jsonAuthModules = createAuthModuleRegistry([
  jsonAuthModule,
  ...builtinAuthModules,
]);

import {
  AuthOperationError,
  createAuthOperations,
  type AuthOperationContext,
  type AiAuthOperations,
} from './operations';

const storageMigration = require('../../../migrations/1000_storage');
const credentialsMigration = require('../../../migrations/2000_credentials');
const journalMigration = require('../../../migrations/4000_journal');

const pgUrl = process.env.AI_TEST_POSTGRES_URL;

const OLD_REFRESH = 'refresh-secret-old-value';
const OLD_ACCESS = 'access-secret-old-value';
const NEW_REFRESH = 'refresh-secret-new-value';
const NEW_ACCESS = 'access-secret-new-value';
const LOGIN_CODE = 'authorization-code-secret-value';
const CODE_VERIFIER = 'pkce-verifier-secret-value';

const fence = {
  namespace: { pluginId: 'plugin', sessionId: 'session' },
  owner: 'owner',
  token: '1',
};

const scope: CredentialScope = { kind: 'user', id: 'user:default/alice' };

type TokenServer = {
  endpoint: string;
  requests: Array<{
    url?: string;
    body: string;
    headers: Record<string, unknown>;
  }>;
  respondWith(status: number, body: unknown): void;
  close(): Promise<void>;
};

async function tokenServer(
  tokenPath = '/v1/oauth/token',
): Promise<TokenServer> {
  const requests: TokenServer['requests'] = [];
  let response = {
    status: 200,
    body: {
      access_token: NEW_ACCESS,
      refresh_token: NEW_REFRESH,
      expires_in: 3600,
      account: 'acct-1',
      id_token: 'id-token-never-copied',
    } as unknown,
  };
  const server: Server = createServer((req, res) => {
    let body = '';
    req.on('data', chunk => {
      body += String(chunk);
    });
    req.on('end', () => {
      requests.push({ url: req.url, body, headers: { ...req.headers } });
      res.writeHead(response.status, { 'content-type': 'application/json' });
      res.end(JSON.stringify(response.body));
    });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = (server.address() as { port: number }).port;
  return {
    endpoint: `http://127.0.0.1:${port}${tokenPath}`,
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
  journal: AttemptJournal;
  stores: AiCredentialStores;
  operations: AiAuthOperations;
  context: AuthOperationContext;
  cleanup(): Promise<void>;
};

async function fixture(
  dialect: 'sqlite' | 'pg',
  endpoint: string,
  options: {
    tokenEndpoints?: Readonly<Record<string, string>>;
    modules?: AuthModuleLookup;
  } = {},
): Promise<Fixture> {
  let db: Knex;
  let cleanup: () => Promise<void>;
  if (dialect === 'sqlite') {
    const dir = await mkdtemp(join(tmpdir(), 'ai-auth-'));
    db = knex({
      client: 'better-sqlite3',
      connection: { filename: join(dir, 'auth.sqlite') },
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
    const schema = `ai_auth_${randomUUID().replace(/-/g, '')}`;
    await admin.schema.createSchema(schema);
    db = knex({ client: 'pg', connection: pgUrl, searchPath: [schema] });
    cleanup = async () => {
      await db.destroy();
      await admin.schema.dropSchema(schema, true);
      await admin.destroy();
    };
  }
  try {
    await storageMigration.up(db);
    await credentialsMigration.up(db);
    await journalMigration.up(db);
    await db('ai_namespace_leases').insert({
      plugin_id: fence.namespace.pluginId,
      session_id: fence.namespace.sessionId,
      owner_id: fence.owner,
      token: fence.token,
      expires_at:
        dialect === 'sqlite'
          ? db.raw("(julianday('now') - 2440587.5) * 86400000 + ?", [300_000])
          : db.raw("statement_timestamp() + interval '300 seconds'"),
    });
    const journal = createAttemptJournal({
      db,
      authorizer: { authorizeAuditRead: async () => true },
    });
    const stores = createCredentialStores({
      db,
      encryptionKey: new Uint8Array(32).fill(4),
      configCredentials: new Map(),
    });
    const guard = createAuthOperationGuard({
      transport: fetch,
      recheck: async () => true,
      journal,
      modules: options.modules ?? jsonAuthModules,
    });
    const operations = createAuthOperations({
      guard,
      journal,
      stores,
      modules: options.modules ?? jsonAuthModules,
      tokenEndpoints: options.tokenEndpoints ?? { anthropic: endpoint },
      clientIds: {
        anthropic: 'client-id',
        openai: 'client-id',
        'openai-secondary': 'client-id',
      },
    });
    const context: AuthOperationContext = {
      actor: 'user:default/alice',
      credentials: mockCredentials.user('user:default/alice'),
      provenance: {
        origin: 'verified',
        conversationId: 'plugin/session',
        taskId: 'plugin/session',
        callId: `plugin/session#${randomUUID().slice(0, 8)}`,
      },
      fence,
      definitionVersion: 'registry-v1',
      configVersion: 'config-v1',
    };
    return { db, journal, stores, operations, context, cleanup };
  } catch (error) {
    await cleanup();
    throw error;
  }
}

function expiredCredential(): OAuthCredential {
  return {
    type: 'oauth',
    refresh: OLD_REFRESH,
    access: OLD_ACCESS,
    expires: Date.now() - 1_000,
  };
}

async function seed(
  stores: AiCredentialStores,
  credential: OAuthCredential,
): Promise<void> {
  await stores.forScope(scope).modify('anthropic', async () => credential);
}

async function journalRows(db: Knex) {
  return db('ai_journal_events')
    .where({ plugin_id: fence.namespace.pluginId })
    .orderBy('id');
}

const engines: [
  string,
  (
    endpoint: string,
    options?: {
      tokenEndpoints?: Readonly<Record<string, string>>;
      modules?: AuthModuleLookup;
    },
  ) => Promise<Fixture>,
][] = [
  ['sqlite', (endpoint, options) => fixture('sqlite', endpoint, options ?? {})],
];
if (pgUrl) {
  engines.push([
    'postgres',
    (endpoint, options) => fixture('pg', endpoint, options ?? {}),
  ]);
} else {
  it.skip('PostgreSQL auth operation tests require AI_TEST_POSTGRES_URL', () => {});
}

describe.each(engines)('%s auth operations', (_engine, make) => {
  let server: TokenServer | undefined;

  afterEach(async () => {
    await server?.close();
    server = undefined;
  });

  async function setup(): Promise<Fixture> {
    server = await tokenServer();
    return make(server.endpoint);
  }

  it('refreshes an expiring credential, persists it and journals the attempt', async () => {
    const f = await setup();
    try {
      await seed(f.stores, expiredCredential());
      const result = await f.operations.refresh({
        context: f.context,
        scope,
        providerId: 'anthropic',
      });

      expect(result.status).toBe('refreshed');
      expect(server!.requests).toHaveLength(1);
      expect(server!.requests[0].url).toBe('/v1/oauth/token');
      expect(server!.requests[0].body).toContain(OLD_REFRESH);
      expect(server!.requests[0].headers['content-type']).toBe(
        'application/json',
      );

      const stored = (await f.stores
        .forScope(scope)
        .read('anthropic')) as OAuthCredential;
      expect(stored.access).toBe(NEW_ACCESS);
      expect(stored.refresh).toBe(NEW_REFRESH);
      expect(stored.expires).toBeGreaterThan(Date.now());
      // Only declared non-secret response fields are copied.
      expect((stored as unknown as { account?: string }).account).toBe(
        'acct-1',
      );
      expect(stored).not.toHaveProperty('id_token');

      const rows = await journalRows(f.db);
      expect(rows).toHaveLength(2);
      expect(rows[0]).toMatchObject({
        operation: 'auth.token',
        decision: 'allow',
        attempt: 1,
        provider: 'anthropic',
        destination: server!.endpoint,
      });
      expect(rows[1]).toMatchObject({ status: 'completed', http_status: 200 });
      // No token, code or verifier value survives in durable audit storage.
      const serialized = JSON.stringify(rows);
      for (const secret of [OLD_REFRESH, OLD_ACCESS, NEW_REFRESH, NEW_ACCESS]) {
        expect(serialized).not.toContain(secret);
      }
    } finally {
      await f.cleanup();
    }
  }, 20000);

  it('does not call the token endpoint for a credential outside the refresh window', async () => {
    const f = await setup();
    try {
      await seed(f.stores, {
        type: 'oauth',
        refresh: OLD_REFRESH,
        access: OLD_ACCESS,
        expires: Date.now() + 3_600_000,
      });
      const result = await f.operations.refresh({
        context: f.context,
        scope,
        providerId: 'anthropic',
      });
      expect(result.status).toBe('fresh');
      expect(server!.requests).toHaveLength(0);
      expect(await journalRows(f.db)).toHaveLength(0);
    } finally {
      await f.cleanup();
    }
  }, 20000);

  it('denies a refresh with no stored credential or a non-OAuth credential', async () => {
    const f = await setup();
    try {
      await expect(
        f.operations.refresh({
          context: f.context,
          scope,
          providerId: 'anthropic',
        }),
      ).rejects.toMatchObject({
        name: 'AuthOperationError',
        code: 'missing-credential',
      });

      await f.stores.forScope(scope).modify('anthropic', async () => ({
        type: 'api_key',
        key: 'sk-static-key',
      }));
      await expect(
        f.operations.refresh({
          context: f.context,
          scope,
          providerId: 'anthropic',
        }),
      ).rejects.toMatchObject({ code: 'not-oauth' });

      expect(server!.requests).toHaveLength(0);
      const rows = await journalRows(f.db);
      const denials = rows.filter(row => row.kind === 'decision');
      expect(denials).toHaveLength(2);
      for (const row of denials) {
        expect(row).toMatchObject({
          operation: 'auth.token',
          decision: 'deny',
        });
        expect(row.destination).toBeNull();
        expect(String(row.reason)).toContain('re-authentication required');
      }
      // Each refusal is also a distinct durable needs-reauth status.
      expect(rows.filter(row => row.kind === 'recovery')).toHaveLength(2);
    } finally {
      await f.cleanup();
    }
  }, 20000);

  it('keeps the stored credential when the provider rejects the refresh', async () => {
    const f = await setup();
    try {
      await seed(f.stores, expiredCredential());
      const before = await f.db('ai_credential_user_secrets').first();
      server!.respondWith(401, {
        error: 'invalid_grant',
        error_description: 'refresh token revoked',
      });

      await expect(
        f.operations.refresh({
          context: f.context,
          scope,
          providerId: 'anthropic',
        }),
      ).rejects.toMatchObject({ name: 'AuthTokenRejection', httpStatus: 401 });

      const after = await f.db('ai_credential_user_secrets').first();
      expect(after.ciphertext).toBe(before.ciphertext);
      expect(after.nonce).toBe(before.nonce);
      expect(
        ((await f.stores.forScope(scope).read('anthropic')) as OAuthCredential)
          .access,
      ).toBe(OLD_ACCESS);

      const rows = await journalRows(f.db);
      expect(rows[0]).toMatchObject({
        decision: 'allow',
        operation: 'auth.token',
      });
      expect(rows[1]).toMatchObject({ status: 'failed', http_status: 401 });
      // The uncertainty is recorded as a distinct needs-reauth recovery event,
      // and the rejected body never reaches durable storage.
      const recovery = rows.find(row => row.kind === 'recovery');
      expect(recovery).toMatchObject({ recovery_kind: 'needs-reauth' });
      expect(JSON.stringify(rows)).not.toContain('invalid_grant');
      expect(JSON.stringify(rows)).not.toContain(OLD_REFRESH);
    } finally {
      await f.cleanup();
    }
  }, 20000);

  it('serializes concurrent refreshes of the same credential', async () => {
    const f = await setup();
    try {
      await seed(f.stores, expiredCredential());
      const results = await Promise.all([
        f.operations.refresh({
          context: f.context,
          scope,
          providerId: 'anthropic',
        }),
        f.operations.refresh({
          context: f.context,
          scope,
          providerId: 'anthropic',
        }),
      ]);
      // The store lock makes the second observe the rotated credential, so the
      // token endpoint is called exactly once: no double-refresh race.
      expect(server!.requests).toHaveLength(1);
      expect(results.map(r => r.status).sort()).toEqual(['fresh', 'refreshed']);
    } finally {
      await f.cleanup();
    }
  }, 20000);

  it('refreshes two providers that share a token route independently', async () => {
    const first = await tokenServer('/oauth/token');
    server = first;
    const second = await tokenServer('/oauth/token');
    const modules = createAuthModuleRegistry([
      formAuthModule,
      { ...formAuthModule, id: 'openai-secondary' },
    ]);
    try {
      const configured = await make(first.endpoint, {
        modules,
        tokenEndpoints: {
          openai: first.endpoint,
          'openai-secondary': second.endpoint,
        },
      });
      for (const [providerId, marker] of [
        ['openai', OLD_REFRESH],
        ['openai-secondary', `${OLD_REFRESH}-secondary`],
      ] as const) {
        await configured.stores
          .forScope(scope)
          .modify(providerId, async () => ({
            type: 'oauth',
            refresh: marker,
            access: `${marker}-access`,
            expires: Date.now() - 1_000,
          }));
      }

      await expect(
        configured.operations.refresh({
          context: configured.context,
          scope,
          providerId: 'openai',
        }),
      ).resolves.toMatchObject({ status: 'refreshed' });
      await expect(
        configured.operations.refresh({
          context: configured.context,
          scope,
          providerId: 'openai-secondary',
        }),
      ).resolves.toMatchObject({ status: 'refreshed' });

      // Each provider used its own endpoint, never a route-derived guess.
      expect(first.requests).toHaveLength(1);
      expect(second.requests).toHaveLength(1);
      expect(first.requests[0].body).toContain(OLD_REFRESH);
      expect(first.requests[0].body).not.toContain(`${OLD_REFRESH}-secondary`);
      expect(second.requests[0].body).toContain(`${OLD_REFRESH}-secondary`);

      const rows = await journalRows(configured.db);
      expect(
        rows
          .filter(row => row.kind === 'decision')
          .map(row => `${row.provider}:${row.destination}`),
      ).toEqual([
        `openai:${first.endpoint}`,
        `openai-secondary:${second.endpoint}`,
      ]);
      await configured.cleanup();
    } finally {
      await second.close();
    }
  }, 20000);

  it('exchanges a login code into the personal store', async () => {
    const f = await setup();
    try {
      const result = await f.operations.exchangeLoginCode({
        context: f.context,
        scope,
        providerId: 'anthropic',
        code: LOGIN_CODE,
        codeVerifier: CODE_VERIFIER,
        redirectUri: 'https://example.test/callback',
      });
      expect(result.status).toBe('stored');
      expect(server!.requests).toHaveLength(1);
      const body = JSON.parse(server!.requests[0].body);
      expect(body).toMatchObject({
        grant_type: 'authorization_code',
        code_verifier: CODE_VERIFIER,
      });
      const stored = (await f.stores.forScope(scope).read('anthropic')) as
        | OAuthCredential
        | undefined;
      expect(stored).toMatchObject({
        type: 'oauth',
        access: NEW_ACCESS,
        refresh: NEW_REFRESH,
      });
      expect(stored).not.toHaveProperty('id_token');

      const rows = await journalRows(f.db);
      expect(rows[0]).toMatchObject({
        operation: 'auth.token-exchange',
        decision: 'allow',
      });
      expect(rows[1]).toMatchObject({ status: 'completed' });
      const serialized = JSON.stringify(rows);
      for (const secret of [LOGIN_CODE, CODE_VERIFIER, NEW_ACCESS]) {
        expect(serialized).not.toContain(secret);
      }
    } finally {
      await f.cleanup();
    }
  }, 20000);

  it('refuses to refresh installation-scoped credentials', async () => {
    const f = await setup();
    try {
      await expect(
        f.operations.refresh({
          context: f.context,
          scope: { kind: 'org' },
          providerId: 'anthropic',
        }),
      ).rejects.toMatchObject({ code: 'unsupported-scope' });
      await expect(
        f.operations.exchangeLoginCode({
          context: f.context,
          scope: { kind: 'service', id: 'catalog-indexer' },
          providerId: 'anthropic',
          code: 'c',
          codeVerifier: 'v',
          redirectUri: 'https://example.test/callback',
        }),
      ).rejects.toMatchObject({ code: 'unsupported-scope' });
      expect(server!.requests).toHaveLength(0);
      expect(await journalRows(f.db)).toHaveLength(0);
    } finally {
      await f.cleanup();
    }
  }, 20000);
});

describe('auth operation construction', () => {
  it('rejects endpoint configurations that are not reserved token routes', () => {
    const common = {
      guard: {} as never,
      journal: {} as AttemptJournal,
      stores: {} as AiCredentialStores,
      modules: jsonAuthModules,
      clientIds: {
        anthropic: 'client-id',
        openai: 'client-id',
        'openai-secondary': 'client-id',
      },
    };
    const invalidEndpoints: Array<Readonly<Record<string, string>>> = [
      {},
      { openai: 'https://token.example/oauth/token?tenant=1' },
      { openai: 'https://token.example/authorize' },
      { openai: 'ftp://token.example/oauth/token' },
      { openai: '' },
    ];
    for (const tokenEndpoints of invalidEndpoints) {
      expect(() => createAuthOperations({ ...common, tokenEndpoints })).toThrow(
        AuthOperationError,
      );
    }
    expect(() =>
      createAuthOperations({
        ...common,
        tokenEndpoints: { openai: 'https://token.example/oauth/token' },
      }),
    ).not.toThrow();
  });

  it('reports the provider rejection as a typed, body-free error', () => {
    const error = new AuthTokenRejection(403, 'openai');
    expect(error.message).toContain('re-authentication required');
    expect(error.message).not.toContain('token=');
  });
});

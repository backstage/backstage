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
import type { Credential, CredentialStore } from '@earendil-works/pi-ai';
import type { AiCredentialStores, CredentialScope } from './credentials/types';
import {
  DefaultAiService,
  type DefaultAiServiceDeps,
} from './DefaultAiService';
import { createRegistry } from '@earendil-works/pi-durable';
import { createAiServiceIntegration } from './integration';
import { runAiMigrations } from './migrations';

/**
 * NONPRODUCTION TEST STAND-IN credential stores: a fixed API key for one
 * provider. Not production credential handling.
 */
function standInCredentialStores(): AiCredentialStores {
  const store: CredentialStore = {
    read: async (providerId: string) =>
      providerId === 'acme'
        ? ({ type: 'api_key', key: 'sk-stand-in' } satisfies Credential)
        : undefined,
    list: async () => [],
    modify: async () => undefined,
    delete: async () => {},
  };
  return {
    forScope(_scope: CredentialScope) {
      return store;
    },
  };
}

function makeDeps(db: Knex): DefaultAiServiceDeps {
  return {
    database: { getClient: async () => db } as DatabaseService,
    auth: {
      isPrincipal: (
        credentials: BackstageCredentials,
        type: 'user' | 'service',
      ) => (credentials.principal as { type: string }).type === type,
    } as unknown as AuthService,
    permissions: {
      authorize: async () => [{ result: 'ALLOW' }],
      authorizeConditional: async () => [{ result: 'ALLOW' }],
    } as unknown as PermissionsService,
    logger: mockServices.logger.mock(),
    auditor: mockServices.auditor.mock(),
    lifecycle: { addShutdownHook: jest.fn() } as unknown as LifecycleService,
    pluginMetadata: { getId: () => 'test-plugin' } as PluginMetadataService,
  };
}

/** A real registry with the required Pi built-ins installed. */
function makeRegistry() {
  return createRegistry();
}

describe('createAiServiceIntegration', () => {
  let directory: string;
  let db: Knex;

  beforeAll(async () => {
    directory = await mkdtemp(join(tmpdir(), 'ai-node-integration-'));
    db = knexFactory({
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

  it('opens, uses, and releases a real managed harness end to end', async () => {
    const deps = makeDeps(db);
    const integration = await createAiServiceIntegration({
      deps,
      credentialStores: standInCredentialStores(),
    });
    const service = DefaultAiService.create({ deps, integration });

    const handle = await service.openHarness({
      sessionId: 's1',
      config: {
        root: new ConfigReader({
          assistant: {
            mode: 'service',
            model: { provider: 'acme', modelId: 'acme-large' },
          },
        }),
        path: 'assistant',
      },
      credentials: mockCredentials.user('user:default/alice'),
      registry: makeRegistry(),
      registryVersion: 'v1',
    });

    // The declared surface works against the real, fenced harness.
    const conversation = await handle.harness.root(handle.context);
    await conversation.configure(
      { instructions: 'inspect the catalog' },
      handle.context,
    );

    // Release closes the harness and storage and releases the lease; a
    // second acquisition of the same namespace succeeds afterwards.
    await handle.release();
    const reopened = await service.openHarness({
      sessionId: 's1',
      config: {
        root: new ConfigReader({
          assistant: {
            mode: 'service',
            model: { provider: 'acme', modelId: 'acme-large' },
          },
        }),
        path: 'assistant',
      },
      credentials: mockCredentials.user('user:default/alice'),
      registry: makeRegistry(),
      registryVersion: 'v1',
    });
    await reopened.harness.root(reopened.context);
    await reopened.release();
  });

  it('denies opens by principals that do not own the session', async () => {
    const deps = makeDeps(db);
    const integration = await createAiServiceIntegration({
      deps,
      credentialStores: standInCredentialStores(),
    });
    const service = DefaultAiService.create({ deps, integration });
    const options = {
      sessionId: 'owned-session',
      config: {
        root: new ConfigReader({
          assistant: {
            mode: 'service',
            model: { provider: 'acme', modelId: 'acme-large' },
          },
        }),
        path: 'assistant',
      },
      registry: makeRegistry(),
      registryVersion: 'v1',
    };

    const handle = await service.openHarness({
      ...options,
      credentials: mockCredentials.user('user:default/alice'),
    });
    await handle.release();

    // Session ownership is fixed at creation through the ownership module.
    await expect(
      service.openHarness({
        ...options,
        credentials: mockCredentials.user('user:default/bob'),
      }),
    ).rejects.toThrow(/Access denied/s);

    // Foreign service principals cannot own sessions at all.
    await expect(
      service.openHarness({
        ...options,
        credentials: mockCredentials.service('external:other'),
      }),
    ).rejects.toThrow(/cannot open a session for the service principal/s);
  });
});

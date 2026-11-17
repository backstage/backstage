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
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import knexFactory from 'knex';
import { ConfigReader } from '@backstage/config';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import type {
  AuthService,
  DatabaseService,
  LifecycleService,
  PermissionsRegistryService,
  PermissionsService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import { createRegistry } from '@earendil-works/pi-durable';
import { DefaultAiService } from '../DefaultAiService';
import { createAiServiceIntegration } from '../integration';
import { runAiMigrations } from '../migrations';
import { createAiHttpSupport } from './index';

describe.each<[string, string | undefined]>([
  ['sqlite', undefined],
  ...(process.env.AI_TEST_POSTGRES_URL
    ? [['postgres', process.env.AI_TEST_POSTGRES_URL] as [string, string]]
    : []),
])('HTTP support (%s)', (_dialect, pgUrl) => {
  it('scopes session and audit reads and enforces each permission', async () => {
    const directory = pgUrl
      ? undefined
      : await mkdtemp(join(tmpdir(), 'ai-http-'));
    const admin = pgUrl
      ? knexFactory({ client: 'pg', connection: pgUrl })
      : undefined;
    const schema = `http_${randomUUID().replaceAll('-', '')}`;
    if (admin) await admin.schema.createSchema(schema);
    const db = pgUrl
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
    try {
      const database = { getClient: async () => db } as DatabaseService;
      const auth = {
        isPrincipal: (c: any, type: string) => c.principal.type === type,
      } as AuthService;
      const allowed = new Set(['ai.session.use', 'ai.audit.read']);
      const permissions = {
        authorize: jest.fn(async (requests: any[]) =>
          requests.map(({ permission }) => ({
            result: allowed.has(permission.name) ? 'ALLOW' : 'DENY',
          })),
        ),
      } as unknown as PermissionsService;
      const pluginMetadata = { getId: () => 'ai' } as PluginMetadataService;
      const deps = {
        database,
        auth,
        permissions,
        pluginMetadata,
        logger: mockServices.logger.mock(),
        auditor: mockServices.auditor.mock(),
        lifecycle: {
          addShutdownHook: jest.fn(),
        } as unknown as LifecycleService,
      };
      await runAiMigrations({ database, logger: deps.logger });
      const integration = await createAiServiceIntegration({ deps });
      const service = DefaultAiService.create({ deps, integration });
      const alice = mockCredentials.user('user:default/alice');
      const bob = mockCredentials.user('user:default/bob');
      const config = new ConfigReader({
        assistant: { mode: 'interactive' },
        ai: {
          models: [
            {
              provider: 'openai',
              modelId: 'first',
              api: 'openai-responses',
              baseUrl: 'https://api.openai.com/v1',
              contextWindow: 10000,
              maxTokens: 1000,
            },
            {
              provider: 'openai',
              modelId: 'second',
              api: 'openai-responses',
              baseUrl: 'https://api.openai.com/v1',
              contextWindow: 10000,
              maxTokens: 1000,
            },
          ],
        },
      });
      for (const sessionId of ['a', 'b']) {
        const handle = await service.openHarness({
          sessionId,
          config: { root: config, path: 'assistant' },
          credentials: alice,
          registry: createRegistry(),
          registryVersion: '1',
        });
        await handle.release();
      }
      const addPermissions = jest.fn();
      const http = await createAiHttpSupport({
        database,
        auth,
        permissions,
        pluginMetadata,
        config,
        permissionsRegistry: {
          addPermissions,
        } as unknown as PermissionsRegistryService,
      });
      expect(addPermissions).toHaveBeenCalled();
      allowed.add('ai.model.openai.first.use');
      expect(await http.listModels(alice)).toEqual([
        { provider: 'openai', modelId: 'first' },
      ]);
      allowed.delete('ai.model.openai.first.use');
      expect(await http.listModels(alice)).toEqual([]);
      await expect(
        http.authorize(mockCredentials.service('external:ci')),
      ).rejects.toThrow('user credentials');
      expect(await http.listSessions(alice, { limit: 1 })).toEqual({
        items: ['a'],
        nextCursor: 'a',
      });
      expect(await http.listSessions(alice, { cursor: 'a' })).toEqual({
        items: ['b'],
      });
      expect(await http.listSessions(bob)).toEqual({ items: [] });
      await expect(http.assertSessionOwner(bob, 'a')).rejects.toThrow(
        'not found',
      );
      await expect(http.assertSessionOwner(alice, 'missing')).rejects.toThrow(
        'not found',
      );
      await expect(http.readAudit(alice, 'a')).resolves.toEqual({ items: [] });
      await expect(http.readAudit(bob, 'a')).rejects.toThrow();
      allowed.delete('ai.audit.read');
      await expect(http.readAudit(alice, 'a')).rejects.toThrow();
      allowed.delete('ai.session.use');
      await expect(http.listSessions(alice)).rejects.toThrow('denied');
      await expect(http.listModels(alice)).rejects.toThrow('denied');
    } finally {
      await db.destroy();
      if (admin) {
        await admin.schema.dropSchema(schema, true);
        await admin.destroy();
      }
      if (directory) await rm(directory, { recursive: true, force: true });
    }
  });
});

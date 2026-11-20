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
import { configureAiInstallation } from './configureAiInstallation';

const KEY = Buffer.alloc(32, 5).toString('base64');
const credentialsMigration = require('../../migrations/2000_credentials');

describe('configureAiInstallation', () => {
  let directory: string;
  let db: Knex;

  beforeAll(async () => {
    directory = await mkdtemp(join(tmpdir(), 'ai-node-config-'));
    db = knexFactory({
      client: 'better-sqlite3',
      connection: { filename: join(directory, 'db') },
      useNullAsDefault: true,
      pool: { min: 1, max: 1 },
    });
    await credentialsMigration.up(db);
  });

  afterAll(async () => {
    await db.destroy();
    await rm(directory, { recursive: true, force: true });
  });

  it('wires no credential stores and no models without configuration', () => {
    const configured = configureAiInstallation({
      source: { root: new ConfigReader({}), path: 'ai' },
      db,
    });
    expect(configured).toEqual({
      models: [],
      credentialPrecedence: 'user-first',
      credentialTokenEndpoints: {},
    });
  });

  it('serves org and service credentials strictly read-only', async () => {
    const configured = configureAiInstallation({
      source: {
        root: new ConfigReader({
          ai: {
            credentials: {
              encryptionKey: KEY,
              scopes: {
                org: {
                  anthropic: { type: 'api_key', key: 'sk-org-anthropic' },
                },
                'service:catalog-indexer': {
                  openai: { type: 'api_key', key: 'sk-service-openai' },
                },
              },
            },
          },
        }),
        path: 'ai',
      },
      db,
    });

    const stores = configured.credentialStores!;
    const org = stores.forScope({ kind: 'org' });
    await expect(org.read('anthropic')).resolves.toEqual({
      type: 'api_key',
      key: 'sk-org-anthropic',
    });
    await expect(org.read('openai')).resolves.toBeUndefined();
    await expect(org.list()).resolves.toEqual([
      { providerId: 'anthropic', type: 'api_key' },
    ]);
    // Read-only invariants survive the config path.
    await expect(
      org.modify('anthropic', async () => undefined),
    ).resolves.toEqual({ type: 'api_key', key: 'sk-org-anthropic' });
    await expect(
      org.modify('anthropic', async () => ({ type: 'api_key', key: 'other' })),
    ).rejects.toThrow(/read-only/);
    await expect(org.delete('anthropic')).rejects.toThrow(/cannot be deleted/);

    const service = stores.forScope({
      kind: 'service',
      id: 'catalog-indexer',
    });
    await expect(service.read('openai')).resolves.toEqual({
      type: 'api_key',
      key: 'sk-service-openai',
    });
    // A service scope that configures nothing is empty, not an error.
    await expect(
      stores.forScope({ kind: 'service', id: 'other' }).read('openai'),
    ).resolves.toBeUndefined();
  });

  it('leaves personal credentials to the encrypted store', async () => {
    const configured = configureAiInstallation({
      source: {
        root: new ConfigReader({
          ai: { credentials: { encryptionKey: KEY, scopes: {} } },
        }),
        path: 'ai',
      },
      db,
    });
    const personal = configured.credentialStores!.forScope({
      kind: 'user',
      id: 'user:default/alice',
    });
    await expect(personal.read('openai')).resolves.toBeUndefined();
    await expect(
      personal.modify('openai', async () => ({
        type: 'api_key',
        key: 'sk-personal',
      })),
    ).resolves.toEqual({ type: 'api_key', key: 'sk-personal' });
    await expect(personal.read('openai')).resolves.toEqual({
      type: 'api_key',
      key: 'sk-personal',
    });
    // The config layer never gains the value.
    await expect(
      configured.credentialStores!.forScope({ kind: 'org' }).read('openai'),
    ).resolves.toBeUndefined();
  });

  it('rejects unusable credential entries with the configuration path', () => {
    expect(() =>
      configureAiInstallation({
        source: {
          root: new ConfigReader({
            ai: {
              credentials: {
                encryptionKey: KEY,
                scopes: { org: { openai: { kind: 'sigv4' } } },
              },
            },
          }),
          path: 'ai',
        },
        db,
      }),
    ).toThrow(/Invalid AI credential configuration at 'ai'/);
  });

  it('carries the configured precedence through', () => {
    const configured = configureAiInstallation({
      source: {
        root: new ConfigReader({
          ai: {
            credentials: { encryptionKey: KEY, precedence: 'org-first' },
          },
        }),
        path: 'ai',
      },
      db,
    });
    expect(configured.credentialPrecedence).toBe('org-first');
  });

  it('reads the installation section from a caller-chosen path', () => {
    const configured = configureAiInstallation({
      source: {
        root: new ConfigReader({
          installation: {
            models: [
              {
                provider: 'openai',
                modelId: 'gpt-5',
                api: 'openai-responses',
                baseUrl: 'https://api.openai.com/v1',
                contextWindow: 400_000,
                maxTokens: 128_000,
              },
            ],
          },
        }),
        path: 'installation',
      },
      db,
    });
    expect(configured.models.map(model => model.id)).toEqual(['gpt-5']);
    expect(configured.credentialStores).toBeUndefined();
  });
});

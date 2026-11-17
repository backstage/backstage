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

import knex, { Knex } from 'knex';
import type { Credential } from '@earendil-works/pi-ai';
import { createCredentialStores } from './createCredentialStores';
import type { CredentialStoresOptions } from './types';

const API_KEY: Credential = { type: 'api_key', key: 'sk-org-secret-value' };

const MIGRATION = require('../../migrations/2000_credentials.js');

function key(seed: string): Uint8Array {
  return new Uint8Array(32).fill(seed.charCodeAt(0));
}

function options(
  overrides: Partial<CredentialStoresOptions> = {},
): CredentialStoresOptions {
  return {
    db: knex({
      client: 'better-sqlite3',
      connection: { filename: ':memory:' },
      useNullAsDefault: true,
    }),
    encryptionKey: key('k'),
    configCredentials: new Map(),
    ...overrides,
  };
}

describe('createCredentialStores', () => {
  let db: Knex | undefined;

  afterEach(async () => {
    await db?.destroy();
    db = undefined;
  });

  it('rejects wrong or unusable encryption keys', () => {
    expect(() =>
      createCredentialStores(options({ encryptionKey: new Uint8Array(16) })),
    ).toThrow(/exactly 32 bytes/);
    expect(() =>
      createCredentialStores(options({ encryptionKey: new Uint8Array(0) })),
    ).toThrow(/exactly 32 bytes/);
    expect(() =>
      createCredentialStores(
        options({ encryptionKey: 'a'.repeat(32) as unknown as Uint8Array }),
      ),
    ).toThrow(/Uint8Array/);
    expect(() =>
      createCredentialStores(
        options({ encryptionKey: undefined as unknown as Uint8Array }),
      ),
    ).toThrow(/Uint8Array/);
  });

  it('rejects malformed config credential scopes and provider IDs', () => {
    const cases: Array<ReadonlyMap<string, ReadonlyMap<string, Credential>>> = [
      new Map([['user', new Map([['openai', API_KEY]])]]),
      new Map([['user:default/guest', new Map([['openai', API_KEY]])]]),
      new Map([['org ', new Map([['openai', API_KEY]])]]),
      new Map([['', new Map([['openai', API_KEY]])]]),
      new Map([['provider', new Map([['openai', API_KEY]])]]),
      new Map([['service:', new Map([['openai', API_KEY]])]]),
      new Map([['service: builder', new Map([['openai', API_KEY]])]]),
      new Map([['org', new Map([['', API_KEY]])]]),
      new Map([['org', new Map([[' openai', API_KEY]])]]),
      new Map([['org', new Map([['openai', { type: 'nope' } as never]])]]),
      new Map([
        ['org', new Map([['openai', { type: 'api_key', key: 42 } as never]])],
      ]),
      new Map([
        [
          'org',
          new Map([['openai', { type: 'api_key', env: { A: 1 } } as never]]),
        ],
      ]),
      new Map([
        ['org', new Map([['openai', { type: 'oauth', access: 'a' } as never]])],
      ]),
    ];
    for (const configCredentials of cases) {
      expect(() =>
        createCredentialStores(options({ configCredentials })),
      ).toThrow();
    }
  });

  it('rejects unsupported scopes from untyped callers', () => {
    const stores = createCredentialStores(options());
    expect(() => stores.forScope({ kind: 'team', id: 'x' } as never)).toThrow(
      /Unsupported credential scope kind/,
    );
    expect(() => stores.forScope({ kind: 'user', id: '   ' })).toThrow(
      /Invalid user scope id/,
    );
    expect(() => stores.forScope({ kind: 'service', id: '' })).toThrow(
      /Invalid service scope id/,
    );
  });

  it('serves org and service credentials read-only from config', async () => {
    const stores = createCredentialStores(
      options({
        configCredentials: new Map([
          ['org', new Map<string, Credential>([['anthropic', API_KEY]])],
          [
            'service:catalog-indexer',
            new Map<string, Credential>([
              [
                'openai',
                { type: 'oauth', refresh: 'r', access: 'a', expires: 1 },
              ],
            ]),
          ],
        ]),
      }),
    );

    const org = stores.forScope({ kind: 'org' });
    await expect(org.read('anthropic')).resolves.toEqual(API_KEY);
    await expect(org.read('openai')).resolves.toBeUndefined();
    await expect(org.list()).resolves.toEqual([
      { providerId: 'anthropic', type: 'api_key' },
    ]);
    await expect(
      org.read('anthropic', { signal: AbortSignal.abort() }),
    ).rejects.toThrow();

    const service = stores.forScope({
      kind: 'service',
      id: 'catalog-indexer',
    });
    await expect(service.list()).resolves.toEqual([
      { providerId: 'openai', type: 'oauth' },
    ]);

    // Unconfigured service scope is empty rather than an error.
    const otherService = stores.forScope({ kind: 'service', id: 'other' });
    await expect(otherService.list()).resolves.toEqual([]);
  });

  it('permits only no-op modify callbacks on config scopes', async () => {
    const stores = createCredentialStores(
      options({
        configCredentials: new Map([
          ['org', new Map<string, Credential>([['anthropic', API_KEY]])],
        ]),
      }),
    );
    const org = stores.forScope({ kind: 'org' });

    await expect(
      org.modify('anthropic', async () => undefined),
    ).resolves.toEqual(API_KEY);
    await expect(
      org.modify('anthropic', async current => ({ ...current! })),
    ).resolves.toEqual(API_KEY);
    await expect(
      org.modify('anthropic', async () => ({ type: 'api_key', key: 'other' })),
    ).rejects.toThrow(/read-only/);
    await expect(
      org.modify('openai', async () => ({ type: 'api_key', key: 'other' })),
    ).rejects.toThrow(/read-only/);
    await expect(org.delete('anthropic')).rejects.toThrow(/cannot be deleted/);
    await expect(org.delete('missing')).rejects.toThrow(/cannot be deleted/);

    // A callback rejection propagates unchanged.
    await expect(
      org.modify('anthropic', async () => {
        throw new Error('callback failed');
      }),
    ).rejects.toThrow('callback failed');
  });

  it('backs user scopes with the writable encrypted store', async () => {
    db = knex({
      client: 'better-sqlite3',
      connection: { filename: ':memory:' },
      useNullAsDefault: true,
    });
    await MIGRATION.up(db);
    const stores = createCredentialStores(options({ db }));

    const alice = stores.forScope({ kind: 'user', id: 'user:default/alice' });
    await expect(alice.read('openai')).resolves.toBeUndefined();
    await expect(alice.modify('openai', async () => API_KEY)).resolves.toEqual(
      API_KEY,
    );
    await expect(alice.read('openai')).resolves.toEqual(API_KEY);
    await expect(alice.list()).resolves.toEqual([
      { providerId: 'openai', type: 'api_key' },
    ]);

    // Personal scopes are isolated from each other.
    const bob = stores.forScope({ kind: 'user', id: 'user:default/bob' });
    await expect(bob.read('openai')).resolves.toBeUndefined();

    await alice.delete('openai');
    await expect(alice.read('openai')).resolves.toBeUndefined();
  });
});

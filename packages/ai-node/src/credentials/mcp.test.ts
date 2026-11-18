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
import knex, { type Knex } from 'knex';
import type { Credential } from '@earendil-works/pi-ai';
import {
  CREDENTIAL_SECRETS_TABLE,
  EncryptedUserCredentialStore,
} from './EncryptedUserCredentialStore';
import { ConfigCredentialStore } from './ConfigCredentialStore';
import {
  interpretMcpCredential,
  mcpCredentialGeneration,
  mcpCredentialId,
} from './mcp';
import type { CredentialScope } from './types';

const MIGRATION = require('../../migrations/2000_credentials.js');

const ENCRYPTION_KEY = new Uint8Array(32).fill(7);

let directory: string;
let filename: string;
let db: Knex;
let scopeCounter = 0;

function userStore(): EncryptedUserCredentialStore {
  return new EncryptedUserCredentialStore({
    db,
    encryptionKey: ENCRYPTION_KEY,
    scopeKey: `user:default/test-${++scopeCounter}`,
  });
}

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'mcp-credentials-'));
  filename = join(directory, 'db.sqlite');
  db = knex({
    client: 'better-sqlite3',
    connection: { filename },
    useNullAsDefault: true,
  });
  await MIGRATION.up(db);
});

afterEach(async () => {
  await db.destroy();
  await rm(directory, { recursive: true, force: true });
});

describe('MCP server credentials in the scoped encrypted stores', () => {
  it('stores and reads an MCP server credential like a provider credential', async () => {
    const store = userStore();
    const id = mcpCredentialId('search-tools');
    const credential: Credential = { type: 'api_key', key: 'mcp-secret-key' };
    await store.modify(id, async () => credential);
    expect(await store.read(id)).toEqual(credential);
    // Opaque entries: the stored row never contains the key material.
    const rows: Array<{
      provider_id: string;
      ciphertext: string;
      nonce: string;
      tag: string;
    }> = await db(CREDENTIAL_SECRETS_TABLE).select(
      'provider_id',
      'ciphertext',
      'nonce',
      'tag',
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].provider_id).toBe(id);
    expect(JSON.stringify(rows[0]).includes('mcp-secret-key')).toBe(false);
  });

  it('isolates MCP server entries per scope and per server', async () => {
    const first = userStore();
    const second = userStore();
    const a = mcpCredentialId('server-a');
    const b = mcpCredentialId('server-b');
    await first.modify(a, async () => ({
      type: 'api_key',
      key: 'key-a',
    }));
    await second.modify(b, async () => ({ type: 'api_key', key: 'key-b' }));
    expect(await first.read(a)).toEqual({ type: 'api_key', key: 'key-a' });
    expect(await first.read(b)).toBeUndefined();
    expect(await second.read(b)).toEqual({ type: 'api_key', key: 'key-b' });
    expect(await second.read(a)).toBeUndefined();
  });

  it('serves org and service scopes read-only from installation config', async () => {
    const orgScope: CredentialScope = { kind: 'org' };
    const serviceScope: CredentialScope = { kind: 'service', id: 'catalog' };
    const id = mcpCredentialId('shared-tools');
    const org = new ConfigCredentialStore(
      orgScope,
      new Map([[id, { type: 'api_key', key: 'org-key' }]]),
    );
    const service = new ConfigCredentialStore(
      serviceScope,
      new Map([[id, { type: 'api_key', key: 'service-key' }]]),
    );
    expect(await org.read(id)).toEqual({ type: 'api_key', key: 'org-key' });
    expect(await service.read(id)).toEqual({
      type: 'api_key',
      key: 'service-key',
    });
    await expect(
      org.modify(id, async () => ({ type: 'api_key', key: 'rotated' })),
    ).rejects.toThrow('read-only');
  });

  it('interprets credential kinds for tool dispatch, failing closed', () => {
    expect(interpretMcpCredential({ type: 'api_key', key: 'token' })).toEqual({
      headers: { authorization: 'Bearer token' },
    });
    expect(
      interpretMcpCredential({
        type: 'oauth',
        refresh: 'r',
        access: 'access-token',
        expires: 1234,
      }),
    ).toEqual({
      headers: { authorization: 'Bearer access-token' },
      expiresAt: 1234,
    });
    expect(() => interpretMcpCredential({ type: 'api_key' })).toThrow(
      're-authenticate the server',
    );
    expect(() => interpretMcpCredential({ type: 'api_key', key: '' })).toThrow(
      're-authenticate the server',
    );
    expect(() =>
      interpretMcpCredential({
        type: 'oauth',
        refresh: 'r',
        access: '',
        expires: 1234,
      }),
    ).toThrow('re-authenticate the server');
  });

  it('derives scoped, rotation-sensitive credential generations', () => {
    const userScope: CredentialScope = { kind: 'user', id: 'default/alice' };
    const otherScope: CredentialScope = { kind: 'user', id: 'default/bob' };
    const first = mcpCredentialGeneration(userScope, 'secret-one');
    expect(first).not.toBe(mcpCredentialGeneration(userScope, 'secret-two'));
    expect(first).not.toBe(mcpCredentialGeneration(otherScope, 'secret-one'));
    expect(first).toBe(mcpCredentialGeneration(userScope, 'secret-one'));
    expect(first).toMatch(/^[0-9a-f]{16}$/);
  });

  it('rejects invalid MCP server identifiers', () => {
    expect(() => mcpCredentialId('')).toThrow('MCP server id');
    expect(() => mcpCredentialId(' leading')).toThrow('MCP server id');
    expect(() => mcpCredentialId(`${'x'.repeat(600)}`)).toThrow(
      'MCP server id',
    );
    expect(mcpCredentialId('server.one')).toBe('mcp:server.one');
  });
});

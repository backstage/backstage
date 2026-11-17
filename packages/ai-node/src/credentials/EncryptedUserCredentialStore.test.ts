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
import knex, { Knex } from 'knex';
import type { Credential } from '@earendil-works/pi-ai';
import {
  CREDENTIAL_LOCKS_TABLE,
  CREDENTIAL_SECRETS_TABLE,
  EncryptedUserCredentialStore,
} from './EncryptedUserCredentialStore';

const MIGRATION = require('../../migrations/2000_credentials.js');

const ENCRYPTION_KEY = new Uint8Array(32).fill(7);
const OTHER_KEY = new Uint8Array(32).fill(9);

let directory: string;
let filename: string;
let db: Knex;
let scopeCounter = 0;

function store(
  scopeKey = `user:default/test-${++scopeCounter}`,
  options: {
    db?: Knex;
    encryptionKey?: Uint8Array;
  } = {},
): EncryptedUserCredentialStore {
  return new EncryptedUserCredentialStore({
    db: options.db ?? db,
    encryptionKey: options.encryptionKey ?? ENCRYPTION_KEY,
    scopeKey,
  });
}

function openDatabase(file: string): Knex {
  return knex({
    client: 'better-sqlite3',
    connection: { filename: file },
    useNullAsDefault: true,
  });
}

async function waitFor(condition: () => boolean, timeoutMs = 5000) {
  const deadline = Date.now() + timeoutMs;
  while (!condition()) {
    if (Date.now() > deadline) {
      throw new Error('Timed out waiting for condition');
    }
    await new Promise(resolve => setTimeout(resolve, 5));
  }
}

describe('EncryptedUserCredentialStore', () => {
  beforeAll(async () => {
    directory = await mkdtemp(join(tmpdir(), 'ai-node-credentials-'));
    filename = join(directory, 'credentials.sqlite');
    db = openDatabase(filename);
    await MIGRATION.up(db);
  });

  afterAll(async () => {
    await db.destroy();
    await rm(directory, { recursive: true, force: true });
  });

  it('round-trips credentials, lists metadata only and deletes', async () => {
    const store1 = store();
    const apiKey: Credential = {
      type: 'api_key',
      key: 'sk-live-round-trip',
      env: { ACCOUNT: 'acct-1' },
    };
    const oauth: Credential = {
      type: 'oauth',
      refresh: 'refresh-secret',
      access: 'access-secret',
      expires: 1_900_000_000_000,
      accountId: 'acct-2',
    };

    await expect(store1.read('anthropic')).resolves.toBeUndefined();
    await expect(
      store1.modify('anthropic', async current => {
        expect(current).toBeUndefined();
        return apiKey;
      }),
    ).resolves.toEqual(apiKey);
    await expect(store1.read('anthropic')).resolves.toEqual(apiKey);
    await store1.modify('openai', async () => oauth);

    const listed = await store1.list();
    expect(listed).toEqual([
      { providerId: 'anthropic', type: 'api_key' },
      { providerId: 'openai', type: 'oauth' },
    ]);
    expect(JSON.stringify(listed)).not.toMatch(
      /sk-live-round-trip|access-secret/,
    );

    await store1.delete('anthropic');
    await expect(store1.read('anthropic')).resolves.toBeUndefined();
    // Deleting a missing credential is not an error.
    await expect(store1.delete('anthropic')).resolves.toBeUndefined();
    await expect(store1.list()).resolves.toEqual([
      { providerId: 'openai', type: 'oauth' },
    ]);
  });

  it('treats an undefined callback result as unchanged, not as delete', async () => {
    const scopeKey = 'user:default/unchanged';
    const store1 = store(scopeKey);
    const credential: Credential = { type: 'api_key', key: 'sk-unchanged' };

    // Absent entry plus undefined leaves nothing behind.
    await expect(
      store1.modify('openai', async () => undefined),
    ).resolves.toBeUndefined();
    await expect(store1.list()).resolves.toEqual([]);

    await store1.modify('openai', async () => credential);
    const before = await db(CREDENTIAL_SECRETS_TABLE)
      .where({ scope: scopeKey })
      .first();
    expect(before).toBeDefined();

    await expect(
      store1.modify('openai', async current => {
        expect(current).toEqual(credential);
        return undefined;
      }),
    ).resolves.toEqual(credential);

    const after = await db(CREDENTIAL_SECRETS_TABLE)
      .where({ scope: scopeKey })
      .first();
    expect(after.nonce).toBe(before.nonce);
    expect(after.ciphertext).toBe(before.ciphertext);
    await expect(store1.read('openai')).resolves.toEqual(credential);

    // A changed value replaces the previous one.
    const rotated: Credential = { type: 'api_key', key: 'sk-rotated' };
    await store1.modify('openai', async () => rotated);
    await expect(store1.read('openai')).resolves.toEqual(rotated);
  });

  it('persists no plaintext and uses a unique nonce per write', async () => {
    const scopeKey = 'user:default/encryption-at-rest';
    const store1 = store(scopeKey);
    const credential: Credential = {
      type: 'oauth',
      refresh: 'plain-refresh-token-value',
      access: 'plain-access-token-value',
      expires: 42,
    };
    await store1.modify('anthropic', async () => credential);
    const first = await db(CREDENTIAL_SECRETS_TABLE)
      .where({ scope: scopeKey, provider_id: 'anthropic' })
      .first();

    await store1.modify('anthropic', async () => credential);
    const second = await db(CREDENTIAL_SECRETS_TABLE)
      .where({ scope: scopeKey, provider_id: 'anthropic' })
      .first();

    for (const row of [first, second]) {
      const serialized = JSON.stringify(row);
      expect(serialized).not.toMatch(
        /plain-refresh-token-value|plain-access-token-value/,
      );
      expect(row.ciphertext).not.toBe(
        Buffer.from(JSON.stringify(credential)).toString('base64'),
      );
      expect(row.algorithm).toBe('aes-256-gcm');
      expect(row.key_version).toBe(1);
    }
    expect(first.nonce).not.toBe(second.nonce);
    expect(first.ciphertext).not.toBe(second.ciphertext);
  });

  it('fails closed on tampered ciphertext, tag, key and scope binding', async () => {
    const scopeKey = 'user:default/tamper';
    const store1 = store(scopeKey);
    const credential: Credential = { type: 'api_key', key: 'sk-tamper-target' };
    await store1.modify('anthropic', async () => credential);

    const row = await db(CREDENTIAL_SECRETS_TABLE)
      .where({ scope: scopeKey, provider_id: 'anthropic' })
      .first();
    const flipLastByte = (value: string) => {
      const bytes = Buffer.from(value, 'base64');
      bytes[bytes.length - 1] ^= 0xff;
      return bytes.toString('base64');
    };

    const restore = async (patch: Record<string, unknown>) => {
      await db(CREDENTIAL_SECRETS_TABLE)
        .where({ scope: scopeKey, provider_id: 'anthropic' })
        .update({ ...row, ...patch });
    };

    await restore({ ciphertext: flipLastByte(row.ciphertext) });
    await expect(store1.read('anthropic')).rejects.toThrow(
      /could not be decrypted/,
    );

    await restore({ tag: flipLastByte(row.tag) });
    await expect(store1.read('anthropic')).rejects.toThrow(
      /could not be decrypted/,
    );

    // The provider ID is authenticated data, so a moved row cannot be read.
    await restore({});
    await db(CREDENTIAL_SECRETS_TABLE)
      .where({ scope: scopeKey, provider_id: 'anthropic' })
      .update({ provider_id: 'openai' });
    await expect(store1.read('openai')).rejects.toThrow(
      /could not be decrypted/,
    );
    await expect(store1.read('anthropic')).resolves.toBeUndefined();

    // Unsupported key version and algorithm are refused, not decrypted.
    await db(CREDENTIAL_SECRETS_TABLE)
      .where({ scope: scopeKey, provider_id: 'openai' })
      .update({ provider_id: 'anthropic', key_version: 2 });
    await expect(store1.read('anthropic')).rejects.toThrow(
      /unsupported key version/,
    );
    await db(CREDENTIAL_SECRETS_TABLE)
      .where({ scope: scopeKey, provider_id: 'anthropic' })
      .update({ key_version: 1, algorithm: 'aes-128-gcm' });
    await expect(store1.read('anthropic')).rejects.toThrow(
      /unsupported algorithm/,
    );
  });

  it('rejects a different encryption key', async () => {
    const scopeKey = 'user:default/wrong-key';
    await store(scopeKey).modify('anthropic', async () => ({
      type: 'api_key',
      key: 'sk-wrong-key',
    }));

    const wrongKeyStore = store(scopeKey, { encryptionKey: OTHER_KEY });
    await expect(wrongKeyStore.read('anthropic')).rejects.toThrow(
      /could not be decrypted/,
    );
    await expect(
      wrongKeyStore.modify('anthropic', async () => undefined),
    ).rejects.toThrow(/could not be decrypted/);
    // Metadata listing never decrypts, so it still works.
    await expect(wrongKeyStore.list()).resolves.toEqual([
      { providerId: 'anthropic', type: 'api_key' },
    ]);
  });

  it('serializes modify across two database connections', async () => {
    const scopeKey = 'user:default/concurrent';
    const otherDb = openDatabase(filename);
    try {
      const store1 = store(scopeKey);
      const store2 = store(scopeKey, { db: otherDb });
      const entered: string[] = [];

      let releaseFirst!: () => void;
      const firstGate = new Promise<void>(resolve => {
        releaseFirst = resolve;
      });

      const first = store1.modify('anthropic', async () => {
        entered.push('first');
        await firstGate;
        return { type: 'api_key', key: 'sk-first' };
      });
      await waitFor(() => entered.length === 1);

      const second = store2.modify('anthropic', async current => {
        entered.push('second');
        return { type: 'api_key', key: `${current?.key ?? 'none'}-second` };
      });

      // The second callback cannot start while the first holds the lock.
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(entered).toEqual(['first']);

      releaseFirst();
      await expect(first).resolves.toEqual({
        type: 'api_key',
        key: 'sk-first',
      });
      // It observed the first write, so the read-modify-write was serialized.
      await expect(second).resolves.toEqual({
        type: 'api_key',
        key: 'sk-first-second',
      });
      await expect(store1.read('anthropic')).resolves.toEqual({
        type: 'api_key',
        key: 'sk-first-second',
      });
    } finally {
      await otherDb.destroy();
    }
  });

  it('honors cancellation before the lock and never after', async () => {
    const scopeKey = 'user:default/cancellation';
    const store1 = store(scopeKey);

    const aborted = AbortSignal.abort();
    let callbackRan = false;
    const callback = async (): Promise<Credential> => {
      callbackRan = true;
      return { type: 'api_key', key: 'sk-cancelled' };
    };

    await expect(
      store1.modify('anthropic', callback, { signal: aborted }),
    ).rejects.toThrow();
    await expect(
      store1.delete('anthropic', { signal: aborted }),
    ).rejects.toThrow();
    await expect(
      store1.read('anthropic', { signal: aborted }),
    ).rejects.toThrow();
    await expect(store1.list({ signal: aborted })).rejects.toThrow();
    expect(callbackRan).toBe(false);
    await expect(store1.read('anthropic')).resolves.toBeUndefined();

    // Once a refresh-style callback is running, caller cancellation must not
    // interrupt it or lose the rotated credential.
    const controller = new AbortController();
    let releaseRefresh!: () => void;
    const refreshGate = new Promise<void>(resolve => {
      releaseRefresh = resolve;
    });
    let refreshStarted = false;

    const modify = store1.modify(
      'anthropic',
      async () => {
        refreshStarted = true;
        await refreshGate;
        return { type: 'api_key', key: 'sk-refreshed' };
      },
      { signal: controller.signal },
    );

    await waitFor(() => refreshStarted);
    controller.abort();
    releaseRefresh();

    await expect(modify).resolves.toEqual({
      type: 'api_key',
      key: 'sk-refreshed',
    });
    await expect(store1.read('anthropic')).resolves.toEqual({
      type: 'api_key',
      key: 'sk-refreshed',
    });
  });

  it('releases the lock after a failing callback or write', async () => {
    const scopeKey = 'user:default/lock-release';
    const store1 = store(scopeKey);

    await expect(
      store1.modify('anthropic', async () => {
        throw new Error('refresh failed');
      }),
    ).rejects.toThrow('refresh failed');

    const lockRow = await db(CREDENTIAL_LOCKS_TABLE)
      .where({ scope: scopeKey, provider_id: 'anthropic' })
      .first();
    expect(lockRow.owner_id).toBeNull();
    await expect(store1.read('anthropic')).resolves.toBeUndefined();
    // The store is usable again immediately.
    await expect(
      store1.modify('anthropic', async () => ({
        type: 'api_key',
        key: 'sk-after-failure',
      })),
    ).resolves.toEqual({ type: 'api_key', key: 'sk-after-failure' });
  });
});

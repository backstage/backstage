/*
 * Copyright 2025 The Backstage Authors
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
import { SecretsStore } from './SecretsStore';
import knexFactory, { Knex } from 'knex';

describe('SecretsStore', () => {
  const encryptionKey = Buffer.from('a'.repeat(32)).toString('base64');

  let db: Knex;
  let store: SecretsStore;

  beforeEach(async () => {
    db = knexFactory({
      client: 'better-sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });
    store = await SecretsStore.create({ db, encryptionKey });
  });

  afterEach(async () => {
    store.dispose();
    await db.destroy();
  });

  it('should create a pending elicitation and retrieve it', async () => {
    const { csrfToken } = await store.createPending(
      'e1',
      'catalog:get-entity',
      'user:default/ben',
    );
    const pending = await store.getPending('e1');

    expect(pending).toEqual({
      actionId: 'catalog:get-entity',
      userEntityRef: 'user:default/ben',
      csrfToken,
    });
  });

  it('should return undefined for non-existent elicitation', async () => {
    expect(await store.getPending('nonexistent')).toBeUndefined();
  });

  it('should complete an elicitation and consume the secrets', async () => {
    await store.createPending('e1', 'catalog:get-entity', 'user:default/ben');
    await store.complete('e1', { token: 'secret-value' });

    const secrets = await store.consume('e1');
    expect(secrets).toEqual({ token: 'secret-value' });

    const secondConsume = await store.consume('e1');
    expect(secondConsume).toBeUndefined();
  });

  it('should return undefined when consuming a pending elicitation', async () => {
    await store.createPending('e1', 'catalog:get-entity', 'user:default/ben');
    expect(await store.consume('e1')).toBeUndefined();
  });

  it('should encrypt secrets at rest', async () => {
    await store.createPending('e1', 'catalog:get-entity', 'user:default/ben');
    await store.complete('e1', { token: 'plaintext-secret' });

    const row = await db('mcp_elicitations')
      .where({ elicitation_id: 'e1' })
      .first();
    expect(row.secrets).not.toContain('plaintext-secret');
    expect(row.secrets).toBeTruthy();
  });

  it('should throw when completing a non-existent elicitation', async () => {
    await expect(store.complete('nonexistent', { token: 'x' })).rejects.toThrow(
      'Elicitation not found or already completed',
    );
  });

  it('should reject an invalid encryption key length', async () => {
    const shortKey = Buffer.from('short').toString('base64');
    await expect(
      SecretsStore.create({ db, encryptionKey: shortKey }),
    ).rejects.toThrow('32-byte key');
  });
});

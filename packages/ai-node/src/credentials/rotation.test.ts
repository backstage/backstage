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
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import knex, { type Knex } from 'knex';
import { ConfigReader } from '@backstage/config';
import { configureAiInstallation } from '../config-extension/configureAiInstallation';
import {
  EncryptedUserCredentialStore,
  CREDENTIAL_SECRETS_TABLE,
} from './EncryptedUserCredentialStore';
import { createCredentialRotation } from './rotation';

const storageMigration = require('../../migrations/1000_storage');
const credentialMigration = require('../../migrations/2000_credentials');

const pgUrl = process.env.AI_TEST_POSTGRES_URL;
const oldKey = new Uint8Array(32).fill(7);
const newKey = new Uint8Array(32).fill(9);
const namespace = { pluginId: 'plugin', sessionId: 'rotation' };
const fence = { namespace, owner: 'owner', token: '1' };

async function fixture(dialect: 'sqlite' | 'pg') {
  let db: Knex;
  let cleanup: () => Promise<void>;
  let childConnection: unknown;
  if (dialect === 'sqlite') {
    const directory = await mkdtemp(join(tmpdir(), 'ai-rotation-'));
    const filename = join(directory, 'credentials.sqlite');
    db = knex({
      client: 'better-sqlite3',
      connection: { filename },
      useNullAsDefault: true,
    });
    childConnection = {
      client: 'better-sqlite3',
      connection: { filename },
      useNullAsDefault: true,
    };
    cleanup = async () => {
      await db.destroy();
      await rm(directory, { recursive: true, force: true });
    };
  } else {
    const admin = knex({ client: 'pg', connection: pgUrl });
    const schema = `ai_rotation_${randomUUID().replace(/-/g, '')}`;
    await admin.schema.createSchema(schema);
    db = knex({ client: 'pg', connection: pgUrl, searchPath: [schema] });
    childConnection = { client: 'pg', connection: pgUrl, searchPath: [schema] };
    cleanup = async () => {
      await db.destroy();
      await admin.schema.dropSchema(schema, true);
      await admin.destroy();
    };
  }
  try {
    await storageMigration.up(db);
    await credentialMigration.up(db);
    await db('ai_namespace_leases').insert({
      plugin_id: namespace.pluginId,
      session_id: namespace.sessionId,
      owner_id: fence.owner,
      token: fence.token,
      expires_at:
        dialect === 'sqlite'
          ? db.raw("(julianday('now') - 2440587.5) * 86400000 + 600000")
          : db.raw("statement_timestamp() + interval '10 minutes'"),
    });
    const store = (
      scope: string,
      encryptionKey: Uint8Array,
      previousEncryptionKey?: Uint8Array,
    ) =>
      new EncryptedUserCredentialStore({
        db,
        scopeKey: scope,
        encryptionKey,
        previousEncryptionKey,
      });
    const rotation = () =>
      createCredentialRotation({
        db,
        encryptionKey: newKey,
        previousEncryptionKey: oldKey,
      });
    return { db, store, rotation, cleanup, childConnection };
  } catch (error) {
    await cleanup();
    throw error;
  }
}

if (!pgUrl) {
  // eslint-disable-next-line jest/no-disabled-tests, jest/expect-expect
  it.skip('PostgreSQL rotation tests require AI_TEST_POSTGRES_URL', () => {});
}

for (const dialect of [
  'sqlite',
  ...(pgUrl ? (['pg'] as const) : []),
] as const) {
  describe(`credential key rotation (${dialect})`, () => {
    it('reads either key, re-encrypts under lock, and fails closed', async () => {
      const f = await fixture(dialect);
      try {
        const scope = 'user:default/alice';
        const old = f.store(scope, oldKey);
        const dual = f.store(scope, newKey, oldKey);
        const current = f.store(scope, newKey);
        await old.modify('anthropic', async () => ({
          type: 'api_key',
          key: 'secret-a',
        }));
        const before = await f
          .db(CREDENTIAL_SECRETS_TABLE)
          .where({ scope, provider_id: 'anthropic' })
          .first();
        expect(before.key_version).toBe(1);
        await expect(current.read('anthropic')).rejects.toThrow(
          /could not be decrypted/,
        );
        await expect(dual.read('anthropic')).resolves.toEqual({
          type: 'api_key',
          key: 'secret-a',
        });
        const after = await f
          .db(CREDENTIAL_SECRETS_TABLE)
          .where({ scope, provider_id: 'anthropic' })
          .first();
        expect(after.key_version).toBe(1);
        expect(after.nonce).not.toBe(before.nonce);
        expect(after.ciphertext).not.toBe(before.ciphertext);
        await expect(old.read('anthropic')).rejects.toThrow(
          /could not be decrypted/,
        );
        await expect(current.read('anthropic')).resolves.toEqual({
          type: 'api_key',
          key: 'secret-a',
        });
        const unchanged = await f
          .db(CREDENTIAL_SECRETS_TABLE)
          .where({ scope, provider_id: 'anthropic' })
          .first();
        expect(unchanged.nonce).toBe(after.nonce);
        await old.modify('openai', async () => ({
          type: 'api_key',
          key: 'secret-b',
        }));
        await expect(
          dual.modify('openai', async () => undefined),
        ).resolves.toEqual({ type: 'api_key', key: 'secret-b' });
        await expect(current.read('openai')).resolves.toEqual({
          type: 'api_key',
          key: 'secret-b',
        });
        await old.modify('corrupt', async () => ({
          type: 'api_key',
          key: 'secret-c',
        }));
        await f
          .db(CREDENTIAL_SECRETS_TABLE)
          .where({ scope, provider_id: 'corrupt' })
          .update({ tag: Buffer.alloc(16).toString('base64') });
        await expect(dual.read('corrupt')).rejects.toThrow(
          /could not be decrypted/,
        );
        await expect(
          f
            .store(
              scope,
              new Uint8Array(32).fill(5),
              new Uint8Array(32).fill(6),
            )
            .read('anthropic'),
        ).rejects.toThrow(/could not be decrypted/);
      } finally {
        await f.cleanup();
      }
    });

    it('wires configured rotation and pages across scoped stores', async () => {
      const f = await fixture(dialect);
      try {
        for (let i = 0; i < 105; i++) {
          await f
            .store(`user:default/${Math.floor(i / 10)}`, oldKey)
            .modify(`provider-${String(i).padStart(3, '0')}`, async () => ({
              type: 'api_key',
              key: `secret-${i}`,
            }));
        }
        const installation = configureAiInstallation({
          db: f.db,
          source: {
            root: new ConfigReader({
              ai: {
                credentials: {
                  encryptionKey: Buffer.from(newKey).toString('base64'),
                  rotation: {
                    previousEncryptionKey:
                      Buffer.from(oldKey).toString('base64'),
                  },
                },
              },
            }),
            path: 'ai',
          },
        });
        expect(installation.credentialRotation).toBeDefined();
        await expect(
          installation.credentialRotation!.rotate(fence),
        ).resolves.toEqual({ inspected: 105, rotated: 105 });
        await expect(
          installation.credentialRotation!.rotate(fence),
        ).resolves.toEqual({ inspected: 105, rotated: 0 });
        await expect(
          installation
            .credentialStores!.forScope({ kind: 'user', id: 'default/10' })
            .read('provider-104'),
        ).resolves.toEqual({ type: 'api_key', key: 'secret-104' });
      } finally {
        await f.cleanup();
      }
    }, 30000);

    it('serializes a read rewrite with writers and fails closed on transaction errors', async () => {
      const f = await fixture(dialect);
      try {
        const scope = 'user:default/concurrent';
        const old = f.store(scope, oldKey);
        const dual = f.store(scope, newKey, oldKey);
        await old.modify('provider', async () => ({
          type: 'api_key',
          key: 'before',
        }));
        let entered!: () => void;
        let release!: () => void;
        const started = new Promise<void>(resolve => {
          entered = resolve;
        });
        const gate = new Promise<void>(resolve => {
          release = resolve;
        });
        const writing = old.modify('provider', async () => {
          entered();
          await gate;
          return { type: 'api_key', key: 'after' };
        });
        await started;
        let readFinished = false;
        const reading = dual.read('provider').then(value => {
          readFinished = true;
          return value;
        });
        try {
          await new Promise(resolve => setTimeout(resolve, 100));
          expect(readFinished).toBe(false);
        } finally {
          release();
        }
        await writing;
        await expect(reading).resolves.toEqual({
          type: 'api_key',
          key: 'after',
        });
        await expect(f.store(scope, newKey).read('provider')).resolves.toEqual({
          type: 'api_key',
          key: 'after',
        });
        await old.modify('failure', async () => ({
          type: 'api_key',
          key: 'untouched',
        }));
        const before = await f
          .db(CREDENTIAL_SECRETS_TABLE)
          .where({ scope, provider_id: 'failure' })
          .first();
        if (dialect === 'sqlite') {
          await f.db.raw(
            `CREATE TRIGGER rotation_fail BEFORE INSERT ON ${CREDENTIAL_SECRETS_TABLE} FOR EACH ROW WHEN NEW.provider_id = 'failure' BEGIN SELECT RAISE(ABORT, 'forced rotation write failure'); END`,
          );
        } else {
          await f.db.raw(
            `CREATE FUNCTION rotation_fail() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.provider_id = 'failure' THEN RAISE EXCEPTION 'forced rotation write failure'; END IF; RETURN NEW; END $$`,
          );
          await f.db.raw(
            `CREATE TRIGGER rotation_fail BEFORE INSERT ON ${CREDENTIAL_SECRETS_TABLE} FOR EACH ROW EXECUTE FUNCTION rotation_fail()`,
          );
        }
        await expect(dual.read('failure')).rejects.toMatchObject({
          message: expect.stringContaining('forced rotation write failure'),
        });
        const after = await f
          .db(CREDENTIAL_SECRETS_TABLE)
          .where({ scope, provider_id: 'failure' })
          .first();
        expect(after.ciphertext).toBe(before.ciphertext);
        await expect(old.read('failure')).resolves.toEqual({
          type: 'api_key',
          key: 'untouched',
        });
        await expect(f.store(scope, newKey).read('failure')).rejects.toThrow(
          /could not be decrypted/,
        );
      } finally {
        await f.cleanup();
      }
    });

    it('rejects a fence lost after enumeration and before a locked write', async () => {
      const f = await fixture(dialect);
      try {
        const scope = 'user:default/fence';
        const old = f.store(scope, oldKey);
        await old.modify('provider', async () => ({
          type: 'api_key',
          key: 'original',
        }));
        let entered!: () => void;
        let release!: () => void;
        let pageRead!: () => void;
        const started = new Promise<void>(resolve => {
          entered = resolve;
        });
        const gate = new Promise<void>(resolve => {
          release = resolve;
        });
        const enumerated = new Promise<void>(resolve => {
          pageRead = resolve;
        });
        const holding = old.modify('provider', async () => {
          entered();
          await gate;
          return undefined;
        });
        await started;
        const listener = (_result: unknown, query: { sql: string }) => {
          if (
            /select .*scope.*provider_id.*ai_credential_user_secrets/i.test(
              query.sql,
            )
          )
            pageRead();
        };
        f.db.on('query-response', listener);
        const rotation = f.rotation().rotate(fence);
        const settled = rotation.then(
          () => undefined,
          error => error,
        );
        try {
          await enumerated;
          await f
            .db('ai_namespace_leases')
            .where({
              plugin_id: namespace.pluginId,
              session_id: namespace.sessionId,
            })
            .update({ token: '2' });
        } finally {
          f.db.removeListener('query-response', listener);
          release();
        }
        await holding;
        expect(await settled).toMatchObject({
          message: 'Credential rotation fence is stale',
        });
        await expect(old.read('provider')).resolves.toEqual({
          type: 'api_key',
          key: 'original',
        });
        await expect(f.store(scope, newKey).read('provider')).rejects.toThrow(
          /could not be decrypted/,
        );
      } finally {
        await f.cleanup();
      }
    }, 30000);

    it('rolls back a rewrite when the fence expires during the write', async () => {
      const f = await fixture(dialect);
      try {
        const scope = 'user:default/expiry';
        await f.store(scope, oldKey).modify('provider', async () => ({
          type: 'api_key',
          key: 'original',
        }));
        if (dialect === 'sqlite') {
          await f.db.raw(
            `CREATE TRIGGER rotation_expire BEFORE INSERT ON ${CREDENTIAL_SECRETS_TABLE} FOR EACH ROW BEGIN UPDATE ai_namespace_leases SET expires_at = 0; END`,
          );
        } else {
          await f.db.raw(
            `CREATE FUNCTION rotation_expire() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN UPDATE ai_namespace_leases SET expires_at = '1970-01-01'; RETURN NEW; END $$`,
          );
          await f.db.raw(
            `CREATE TRIGGER rotation_expire BEFORE INSERT ON ${CREDENTIAL_SECRETS_TABLE} FOR EACH ROW EXECUTE FUNCTION rotation_expire()`,
          );
        }
        await expect(f.rotation().rotate(fence)).rejects.toThrow(
          'Credential rotation fence is stale',
        );
        await expect(f.store(scope, oldKey).read('provider')).resolves.toEqual({
          type: 'api_key',
          key: 'original',
        });
        await expect(f.store(scope, newKey).read('provider')).rejects.toThrow(
          /could not be decrypted/,
        );
      } finally {
        await f.cleanup();
      }
    });

    it('fences every batch write and resumes safely after interruption', async () => {
      const f = await fixture(dialect);
      try {
        for (const [scope, id] of [
          ['user:default/a', 'alpha'],
          ['user:default/b', 'beta'],
          ['user:default/b', 'gamma'],
        ]) {
          await f.store(scope, oldKey).modify(id, async () => ({
            type: 'api_key',
            key: `${scope}-${id}`,
          }));
        }
        await expect(
          f.rotation().rotate({ ...fence, token: '2' }),
        ).rejects.toThrow('Credential rotation fence is stale');
        await expect(
          f.store('user:default/a', newKey).read('alpha'),
        ).rejects.toThrow(/could not be decrypted/);
        const script = `
          import knex from 'knex'; import { registerHooks } from 'node:module'; import { writeSync } from 'node:fs';
          registerHooks({ resolve(specifier, context, nextResolve) { if (context.parentURL?.includes('/packages/ai-node/src/') && specifier.startsWith('.') && !specifier.endsWith('.ts') && !specifier.endsWith('.js')) return nextResolve(specifier + '.ts', context); return nextResolve(specifier, context); } });
          const { createCredentialRotation } = await import(${JSON.stringify(
            pathToFileURL(join(__dirname, 'rotation.ts')).href,
          )});
          const db = knex(JSON.parse(process.argv[1])); let wrote = false;
          db.on('query', q => { if (/insert into [\\\"\x60]?ai_credential_user_secrets/i.test(q.sql)) wrote = true; });
          db.on('query-response', (_response, q) => { if (wrote && /update [\\\"\x60]?ai_credential_locks/i.test(q.sql) && q.bindings[0] === null) { writeSync(1, 'COMMITTED\\n'); process.kill(process.pid, 'SIGSTOP'); } });
          await createCredentialRotation({db,encryptionKey:new Uint8Array(32).fill(9),previousEncryptionKey:new Uint8Array(32).fill(7)}).rotate(${JSON.stringify(
            fence,
          )});
          await db.destroy();
        `;
        const child = spawn(
          process.execPath,
          [
            '--experimental-strip-types',
            '--input-type=module',
            '-e',
            script,
            JSON.stringify(f.childConnection),
          ],
          { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] },
        );
        let stderr = '';
        child.stderr.on('data', data => {
          stderr += String(data);
        });
        try {
          await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(
              () => reject(new Error(`child did not commit: ${stderr}`)),
              15000,
            );
            child.stdout.on('data', data => {
              if (String(data).includes('COMMITTED')) {
                clearTimeout(timer);
                resolve();
              }
            });
            child.once('exit', code => {
              clearTimeout(timer);
              reject(new Error(`child exited ${code}: ${stderr}`));
            });
          });
          const exited = new Promise<NodeJS.Signals | null>(resolve =>
            child.once('exit', (_code, signal) => resolve(signal)),
          );
          expect(child.kill('SIGKILL')).toBe(true);
          expect(await exited).toBe('SIGKILL');
        } finally {
          if (child.exitCode === null && child.signalCode === null)
            child.kill('SIGKILL');
        }
        await expect(
          f.store('user:default/a', newKey).read('alpha'),
        ).resolves.toEqual({ type: 'api_key', key: 'user:default/a-alpha' });
        await expect(
          f.store('user:default/b', oldKey).read('beta'),
        ).resolves.toEqual({ type: 'api_key', key: 'user:default/b-beta' });
        await expect(f.rotation().rotate(fence)).resolves.toEqual({
          inspected: 3,
          rotated: 2,
        });
        await expect(f.rotation().rotate(fence)).resolves.toEqual({
          inspected: 3,
          rotated: 0,
        });
        for (const [scope, id] of [
          ['user:default/a', 'alpha'],
          ['user:default/b', 'beta'],
          ['user:default/b', 'gamma'],
        ]) {
          await expect(f.store(scope, newKey).read(id)).resolves.toEqual({
            type: 'api_key',
            key: `${scope}-${id}`,
          });
        }
      } finally {
        await f.cleanup();
      }
    }, 30000);
  });
}

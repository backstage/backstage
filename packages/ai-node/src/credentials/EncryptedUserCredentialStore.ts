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

import { randomUUID } from 'node:crypto';
import type {
  AuthOperationOptions,
  Credential,
  CredentialInfo,
  CredentialStore,
} from '@earendil-works/pi-ai';
import type { Knex } from 'knex';
import {
  assertEncryptionKey,
  credentialAad,
  openCredential,
  sealCredential,
} from './encryption';
import { assertCredential, assertIdentifier } from './identifiers';

/** Table holding encrypted personal credentials, one row per (scope, provider). */
export const CREDENTIAL_SECRETS_TABLE = 'ai_credential_user_secrets';

/**
 * Table holding the cross-process lock for (scope, provider). A row exists even
 * when no credential has ever been stored, so concurrent first writes are
 * serialized too.
 */
export const CREDENTIAL_LOCKS_TABLE = 'ai_credential_locks';

/** How long a claimed lock stays valid without a renewal. */
const LOCK_TTL_MS = 30_000;
/** How often a held lock is renewed while the modify callback runs. */
const LOCK_RENEW_MS = 5_000;
/** How long a caller waits for another process to release the lock. */
const LOCK_ACQUIRE_TIMEOUT_MS = 30_000;
/** Delay between claim attempts, kept short so an in-flight callback is not starved. */
const LOCK_RETRY_MS = 10;

interface SecretsRow {
  provider_id: string;
  credential_type: string;
  algorithm: string;
  key_version: number;
  nonce: string;
  ciphertext: string;
  tag: string;
}

/**
 * Encrypted, cross-process serialized Pi credential store for one personal
 * scope.
 *
 * Every row is sealed with AES-256-GCM under a unique nonce, and the scope and
 * provider ID are bound as additional authenticated data, so ciphertext cannot
 * be replayed into another scope or provider. Algorithm and key version are
 * stored per row. No plaintext credential is ever written, logged or included
 * in an error.
 *
 * `modify` and `delete` serialize `(scope, providerId)` across processes with a
 * lock row whose claim, renewal and release all go through the database. The
 * lock is held across the async callback and the durable write, and is asserted
 * inside the writing transaction, so a lock that was taken over after expiry
 * can no longer commit. Caller cancellation is honored until the lock is
 * acquired and never after: an OAuth refresh that has started must be allowed
 * to persist a rotated token.
 *
 * Lock expiry and renewal use the local wall clock, so stale-lock recovery
 * assumes roughly synchronized hosts. This affects only how quickly a crashed
 * writer's lock can be reclaimed, not the serialization of live writers.
 */
export class EncryptedUserCredentialStore implements CredentialStore {
  readonly #db: Knex;
  readonly #key: Buffer;
  readonly #scopeKey: string;

  constructor(options: {
    db: Knex;
    encryptionKey: Uint8Array;
    scopeKey: string;
  }) {
    this.#db = options.db;
    this.#key = assertEncryptionKey(options.encryptionKey);
    this.#scopeKey = options.scopeKey;
  }

  async read(
    providerId: string,
    options?: AuthOperationOptions,
  ): Promise<Credential | undefined> {
    const id = assertIdentifier(providerId, 'provider ID');
    options?.signal?.throwIfAborted();
    const row = await this.#selectRow(this.#db, id);
    return row === undefined ? undefined : this.#decode(row);
  }

  async list(
    options?: AuthOperationOptions,
  ): Promise<readonly CredentialInfo[]> {
    options?.signal?.throwIfAborted();
    const rows: Array<{ provider_id: string; credential_type: string }> =
      await this.#db(CREDENTIAL_SECRETS_TABLE)
        .select('provider_id', 'credential_type')
        .where({ scope: this.#scopeKey })
        .orderBy('provider_id');
    return rows.map(row => ({
      providerId: row.provider_id,
      type: row.credential_type as CredentialInfo['type'],
    }));
  }

  async modify(
    providerId: string,
    fn: (current: Credential | undefined) => Promise<Credential | undefined>,
    options?: AuthOperationOptions,
  ): Promise<Credential | undefined> {
    const id = assertIdentifier(providerId, 'provider ID');
    return this.#withLock(id, options?.signal, async owner => {
      const row = await this.#selectRow(this.#db, id);
      const current = row === undefined ? undefined : this.#decode(row);

      // No cancellation checks past this point by design.
      const next = await fn(current);
      if (next === undefined) {
        // A no-op still has to fail closed if the lock was taken over while the
        // callback ran, otherwise the caller would resolve with a value that is
        // no longer stored.
        await this.#assertLockHeldInTransaction(id, owner);
        return current;
      }

      const credential = assertCredential(
        next,
        `credential ${this.#scopeKey}/${id}`,
      );
      const sealed = sealCredential(
        this.#key,
        credentialAad(this.#scopeKey, id),
        JSON.stringify(credential),
      );
      await this.#db.transaction(async trx => {
        await this.#assertLockHeld(trx, id, owner);
        await trx(CREDENTIAL_SECRETS_TABLE)
          .insert({
            scope: this.#scopeKey,
            provider_id: id,
            credential_type: credential.type,
            algorithm: sealed.algorithm,
            key_version: sealed.keyVersion,
            nonce: sealed.nonce,
            ciphertext: sealed.ciphertext,
            tag: sealed.tag,
            updated_at: new Date(),
          })
          .onConflict(['scope', 'provider_id'])
          .merge();
      });
      return credential;
    });
  }

  async delete(
    providerId: string,
    options?: AuthOperationOptions,
  ): Promise<void> {
    const id = assertIdentifier(providerId, 'provider ID');
    await this.#withLock(id, options?.signal, async owner => {
      await this.#db.transaction(async trx => {
        await this.#assertLockHeld(trx, id, owner);
        await trx(CREDENTIAL_SECRETS_TABLE)
          .where({ scope: this.#scopeKey, provider_id: id })
          .del();
      });
    });
  }

  #decode(row: SecretsRow): Credential {
    const plaintext = openCredential(
      this.#key,
      this.#scopeKey,
      row.provider_id,
      {
        algorithm: row.algorithm,
        keyVersion: row.key_version,
        nonce: row.nonce,
        ciphertext: row.ciphertext,
        tag: row.tag,
      },
    );
    let parsed: unknown;
    try {
      parsed = JSON.parse(plaintext);
    } catch {
      throw new Error(
        `Stored credential for ${row.provider_id} is corrupted: decrypted value is not valid JSON`,
      );
    }
    const credential = assertCredential(
      parsed,
      `credential ${this.#scopeKey}/${row.provider_id}`,
    );
    if (credential.type !== row.credential_type) {
      throw new Error(
        `Stored credential for ${row.provider_id} is corrupted: type metadata does not match the sealed value`,
      );
    }
    return credential;
  }

  async #selectRow(
    db: Knex | Knex.Transaction,
    providerId: string,
  ): Promise<SecretsRow | undefined> {
    return db(CREDENTIAL_SECRETS_TABLE)
      .where({ scope: this.#scopeKey, provider_id: providerId })
      .first();
  }

  async #withLock<T>(
    providerId: string,
    signal: AbortSignal | undefined,
    work: (owner: string) => Promise<T>,
  ): Promise<T> {
    signal?.throwIfAborted();
    const owner = randomUUID();
    const deadline = Date.now() + LOCK_ACQUIRE_TIMEOUT_MS;
    for (;;) {
      if (await this.#tryClaim(providerId, owner)) {
        break;
      }
      if (Date.now() >= deadline) {
        throw new Error(
          `Timed out waiting for the credential lock on ${
            this.#scopeKey
          }/${providerId}`,
        );
      }
      signal?.throwIfAborted();
      await delay(LOCK_RETRY_MS);
    }

    const renewal = setInterval(() => {
      void this.#renew(providerId, owner).catch(() => undefined);
    }, LOCK_RENEW_MS);
    try {
      return await work(owner);
    } finally {
      clearInterval(renewal);
      // A failed release only delays the next claim until the lock expires; it
      // must not turn a committed write into a rejected operation.
      await this.#release(providerId, owner).catch(() => undefined);
    }
  }

  async #tryClaim(providerId: string, owner: string): Promise<boolean> {
    const now = Date.now();
    await this.#db(CREDENTIAL_LOCKS_TABLE)
      .insert({
        scope: this.#scopeKey,
        provider_id: providerId,
        owner_id: null,
        expires_at: null,
      })
      .onConflict(['scope', 'provider_id'])
      .ignore();
    const claimed = await this.#db(CREDENTIAL_LOCKS_TABLE)
      .where({ scope: this.#scopeKey, provider_id: providerId })
      .andWhere(builder =>
        builder.whereNull('owner_id').orWhere('expires_at', '<', now),
      )
      .update({ owner_id: owner, expires_at: now + LOCK_TTL_MS });
    return claimed > 0;
  }

  async #renew(providerId: string, owner: string): Promise<void> {
    await this.#db(CREDENTIAL_LOCKS_TABLE)
      .where({
        scope: this.#scopeKey,
        provider_id: providerId,
        owner_id: owner,
      })
      .update({ expires_at: Date.now() + LOCK_TTL_MS });
  }

  async #release(providerId: string, owner: string): Promise<void> {
    await this.#db(CREDENTIAL_LOCKS_TABLE)
      .where({
        scope: this.#scopeKey,
        provider_id: providerId,
        owner_id: owner,
      })
      .update({ owner_id: null, expires_at: null });
  }

  async #assertLockHeldInTransaction(
    providerId: string,
    owner: string,
  ): Promise<void> {
    await this.#db.transaction(trx =>
      this.#assertLockHeld(trx, providerId, owner),
    );
  }

  async #assertLockHeld(
    trx: Knex.Transaction,
    providerId: string,
    owner: string,
  ): Promise<void> {
    // Written rather than read so the assertion holds the lock row until this
    // transaction commits: a takeover that started after expiry cannot commit
    // in between.
    const held = await trx(CREDENTIAL_LOCKS_TABLE)
      .where({
        scope: this.#scopeKey,
        provider_id: providerId,
        owner_id: owner,
      })
      .andWhere('expires_at', '>', Date.now())
      .update({ expires_at: Date.now() + LOCK_TTL_MS });
    if (held === 0) {
      throw new Error(
        `Lost the credential lock on ${
          this.#scopeKey
        }/${providerId} before committing`,
      );
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

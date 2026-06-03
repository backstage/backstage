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
import { Knex } from 'knex';
import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  randomUUID,
} from 'node:crypto';
import { JsonObject } from '@backstage/types';
import { resolvePackagePath } from '@backstage/backend-plugin-api';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const TTL_MS = 5 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 60 * 1000;

export class SecretsStore {
  private cleanupTimer: ReturnType<typeof setInterval> | undefined;

  private constructor(
    private readonly db: Knex,
    private readonly encryptionKey: Buffer,
  ) {}

  static async create(opts: {
    db: Knex;
    encryptionKey: string;
  }): Promise<SecretsStore> {
    const key = Buffer.from(opts.encryptionKey, 'base64');
    if (key.length !== 32) {
      throw new Error(
        'mcpActions.secrets.encryptionKey must be a 32-byte key, base64-encoded',
      );
    }

    const migrationsDir = resolvePackagePath(
      '@backstage/plugin-mcp-actions-backend',
      'migrations',
    );
    await opts.db.migrate.latest({ directory: migrationsDir });

    const store = new SecretsStore(opts.db, key);
    store.startCleanup();
    return store;
  }

  async createPending(
    elicitationId: string,
    actionId: string,
    userEntityRef: string,
  ): Promise<{ csrfToken: string }> {
    const csrfToken = randomUUID();
    await this.db('mcp_elicitations').insert({
      elicitation_id: elicitationId,
      action_id: actionId,
      user_entity_ref: userEntityRef,
      csrf_token: csrfToken,
      status: 'pending',
    });
    return { csrfToken };
  }

  async getPending(
    elicitationId: string,
  ): Promise<
    { actionId: string; userEntityRef: string; csrfToken: string } | undefined
  > {
    const row = await this.db('mcp_elicitations')
      .where({ elicitation_id: elicitationId, status: 'pending' })
      .first();

    if (!row) return undefined;

    const createdAt = new Date(row.created_at).getTime();
    if (Date.now() - createdAt > TTL_MS) return undefined;

    return {
      actionId: row.action_id,
      userEntityRef: row.user_entity_ref,
      csrfToken: row.csrf_token,
    };
  }

  async complete(elicitationId: string, secrets: JsonObject): Promise<void> {
    const encrypted = this.encrypt(JSON.stringify(secrets));
    const updated = await this.db('mcp_elicitations')
      .where({ elicitation_id: elicitationId, status: 'pending' })
      .update({ secrets: encrypted, status: 'completed' });
    if (updated === 0) {
      throw new Error('Elicitation not found or already completed');
    }
  }

  async consume(elicitationId: string): Promise<JsonObject | undefined> {
    return this.db.transaction(async trx => {
      const row = await trx('mcp_elicitations')
        .where({ elicitation_id: elicitationId, status: 'completed' })
        .first();

      if (!row) return undefined;

      await trx('mcp_elicitations')
        .where({ elicitation_id: elicitationId })
        .del();

      return JSON.parse(this.decrypt(row.secrets));
    });
  }

  private encrypt(plaintext: string): string {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, this.encryptionKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, encrypted, authTag]).toString('base64');
  }

  private decrypt(ciphertext: string): string {
    const buf = Buffer.from(ciphertext, 'base64');
    const iv = buf.subarray(0, IV_LENGTH);
    const authTag = buf.subarray(buf.length - AUTH_TAG_LENGTH);
    const encrypted = buf.subarray(IV_LENGTH, buf.length - AUTH_TAG_LENGTH);
    const decipher = createDecipheriv(ALGORITHM, this.encryptionKey, iv);
    decipher.setAuthTag(authTag);
    return decipher.update(encrypted) + decipher.final('utf8');
  }

  private startCleanup() {
    this.cleanupTimer = setInterval(async () => {
      try {
        const cutoff = new Date(Date.now() - TTL_MS);
        await this.db('mcp_elicitations')
          .where('created_at', '<', cutoff.toISOString())
          .del();
      } catch {
        // next interval will retry
      }
    }, CLEANUP_INTERVAL_MS);
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  dispose() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }
}

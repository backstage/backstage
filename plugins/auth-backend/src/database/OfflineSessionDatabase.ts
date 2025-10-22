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
import { DateTime } from 'luxon';
import {
  coreServices,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import { Expand, durationToMilliseconds } from '@backstage/types';
import { readDurationFromConfig } from '@backstage/config';

const MAX_TOKENS_PER_USER = 20;

const TABLE_NAME = 'offline_sessions';

type DbOfflineSessionRow = {
  id: string;
  user_entity_ref: string;
  oidc_client_id: string | null;
  token_hash: string;
  created_at: Date;
  last_used_at: Date;
};

/**
 * Represents an offline session for refresh tokens
 * @public
 */
export type OfflineSession = {
  id: string;
  userEntityRef: string;
  oidcClientId: string | null;
  tokenHash: string;
  createdAt: Date;
  lastUsedAt: Date;
};

/**
 * Options for creating a new offline session
 * @public
 */
export type CreateOfflineSessionOptions = {
  id: string;
  userEntityRef: string;
  oidcClientId?: string;
  tokenHash: string;
};

/**
 * Database layer for managing offline sessions (refresh tokens)
 * @public
 */
export class OfflineSessionDatabase {
  readonly #knex: Knex;
  readonly #tokenLifetimeSeconds: number;
  readonly #maxRotationLifetimeSeconds: number;

  static create(options: {
    knex: Knex;
    tokenLifetimeSeconds: number;
    maxRotationLifetimeSeconds: number;
  }) {
    return new OfflineSessionDatabase(
      options.knex,
      options.tokenLifetimeSeconds,
      options.maxRotationLifetimeSeconds,
    );
  }

  private constructor(
    knex: Knex,
    tokenLifetimeSeconds: number,
    maxRotationLifetimeSeconds: number,
  ) {
    this.#knex = knex;
    this.#tokenLifetimeSeconds = tokenLifetimeSeconds;
    this.#maxRotationLifetimeSeconds = maxRotationLifetimeSeconds;
  }

  /**
   * Create a new offline session
   * Automatically enforces per-user and per-client limits
   */
  async createSession(
    options: CreateOfflineSessionOptions,
  ): Promise<OfflineSession> {
    const { id, userEntityRef, oidcClientId, tokenHash } = options;

    await this.#knex.transaction(async trx => {
      // Delete existing session for same OIDC client if present
      if (oidcClientId) {
        await trx<DbOfflineSessionRow>(TABLE_NAME)
          .where('oidc_client_id', oidcClientId)
          .delete();
      }

      // Enforce per-user limit (20 tokens max)
      const userSessions = await trx<DbOfflineSessionRow>(TABLE_NAME)
        .where('user_entity_ref', userEntityRef)
        .select('id', 'last_used_at')
        .orderBy('last_used_at', 'asc');

      const tokensToDelete = userSessions.length - (MAX_TOKENS_PER_USER - 1);

      if (tokensToDelete > 0) {
        const idsToDelete = userSessions
          .slice(0, tokensToDelete)
          .map(s => s.id);

        await trx(TABLE_NAME).whereIn('id', idsToDelete).delete();
      }

      // Insert new session
      await trx<DbOfflineSessionRow>(TABLE_NAME).insert({
        id,
        user_entity_ref: userEntityRef,
        oidc_client_id: oidcClientId ?? null,
        token_hash: tokenHash,
        created_at: trx.fn.now(),
        last_used_at: trx.fn.now(),
      });
    });

    const session = await this.getSessionById(id);
    if (!session) {
      throw new Error('Failed to create session');
    }
    return session;
  }

  /**
   * Get a session by its ID
   */
  async getSessionById(id: string): Promise<OfflineSession | undefined> {
    const row = await this.#knex<DbOfflineSessionRow>(TABLE_NAME)
      .where('id', id)
      .first();

    if (!row) {
      return undefined;
    }

    return this.#mapRow(row);
  }

  /**
   * Rotate the token for a session (update hash and last_used_at)
   */
  async rotateToken(id: string, newTokenHash: string): Promise<void> {
    await this.#knex<DbOfflineSessionRow>(TABLE_NAME).where('id', id).update({
      token_hash: newTokenHash,
      last_used_at: this.#knex.fn.now(),
    });
  }

  /**
   * Delete a session by ID
   */
  async deleteSession(id: string): Promise<number> {
    return await this.#knex<DbOfflineSessionRow>(TABLE_NAME)
      .where('id', id)
      .delete();
  }

  /**
   * Delete all sessions for a user entity ref
   */
  async deleteSessionsByUserEntityRef(userEntityRef: string): Promise<number> {
    return await this.#knex<DbOfflineSessionRow>(TABLE_NAME)
      .where('user_entity_ref', userEntityRef)
      .delete();
  }

  /**
   * Delete a session by OIDC client ID
   */
  async deleteSessionByClientId(oidcClientId: string): Promise<number> {
    return await this.#knex<DbOfflineSessionRow>(TABLE_NAME)
      .where('oidc_client_id', oidcClientId)
      .delete();
  }

  /**
   * Cleanup expired sessions based on both time windows
   * - Short window: last_used_at + tokenLifetime
   * - Long window: created_at + maxRotationLifetime
   */
  async cleanupExpiredSessions(): Promise<number> {
    const now = DateTime.utc();
    const tokenLifetimeThreshold = now
      .minus({ seconds: this.#tokenLifetimeSeconds })
      .toJSDate();
    const maxRotationThreshold = now
      .minus({ seconds: this.#maxRotationLifetimeSeconds })
      .toJSDate();

    return await this.#knex<DbOfflineSessionRow>(TABLE_NAME)
      .where('last_used_at', '<', tokenLifetimeThreshold)
      .orWhere('created_at', '<', maxRotationThreshold)
      .delete();
  }

  /**
   * Check if a session is expired based on both time windows
   */
  isSessionExpired(session: OfflineSession): boolean {
    const now = DateTime.utc();
    const lastUsedExpiry = DateTime.fromJSDate(session.lastUsedAt).plus({
      seconds: this.#tokenLifetimeSeconds,
    });
    const createdExpiry = DateTime.fromJSDate(session.createdAt).plus({
      seconds: this.#maxRotationLifetimeSeconds,
    });

    return now > lastUsedExpiry || now > createdExpiry;
  }

  #mapRow(row: DbOfflineSessionRow): OfflineSession {
    return {
      id: row.id,
      userEntityRef: row.user_entity_ref,
      oidcClientId: row.oidc_client_id,
      tokenHash: row.token_hash,
      createdAt: new Date(row.created_at),
      lastUsedAt: new Date(row.last_used_at),
    };
  }
}

/**
 * Service reference for OfflineSessionDatabase
 * @public
 */
export const offlineSessionDatabaseRef = createServiceRef<
  Expand<OfflineSessionDatabase>
>({
  id: 'auth.offlineSessionDatabase',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {
        database: coreServices.database,
        config: coreServices.rootConfig,
      },
      async factory(deps) {
        const tokenLifetime = deps.config.has('auth.refreshToken.tokenLifetime')
          ? readDurationFromConfig(deps.config, {
              key: 'auth.refreshToken.tokenLifetime',
            })
          : { days: 30 };

        const maxRotationLifetime = deps.config.has(
          'auth.refreshToken.maxRotationLifetime',
        )
          ? readDurationFromConfig(deps.config, {
              key: 'auth.refreshToken.maxRotationLifetime',
            })
          : { years: 1 };

        const tokenLifetimeSeconds = Math.floor(
          durationToMilliseconds(tokenLifetime) / 1000,
        );
        const maxRotationLifetimeSeconds = Math.floor(
          durationToMilliseconds(maxRotationLifetime) / 1000,
        );

        const knex = await deps.database.getClient();

        return OfflineSessionDatabase.create({
          knex,
          tokenLifetimeSeconds,
          maxRotationLifetimeSeconds,
        });
      },
    }),
});

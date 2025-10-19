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
import { Expand } from '@backstage/types';

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
  private static readonly TABLE_NAME = 'offline_sessions';
  private static readonly MAX_TOKENS_PER_USER = 20;

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
        await trx(OfflineSessionDatabase.TABLE_NAME)
          .where('oidc_client_id', oidcClientId)
          .delete();
      }

      // Enforce per-user limit (20 tokens max)
      await this.enforceUserLimit(userEntityRef, trx);

      // Insert new session
      await trx(OfflineSessionDatabase.TABLE_NAME).insert({
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
    const row = await this.#knex(OfflineSessionDatabase.TABLE_NAME)
      .where('id', id)
      .first();

    if (!row) {
      return undefined;
    }

    return this.mapRow(row);
  }

  /**
   * Rotate the token for a session (update hash and last_used_at)
   */
  async rotateToken(id: string, newTokenHash: string): Promise<void> {
    await this.#knex(OfflineSessionDatabase.TABLE_NAME).where('id', id).update({
      token_hash: newTokenHash,
      last_used_at: this.#knex.fn.now(),
    });
  }

  /**
   * Delete a session by ID
   */
  async deleteSession(id: string): Promise<number> {
    return await this.#knex(OfflineSessionDatabase.TABLE_NAME)
      .where('id', id)
      .delete();
  }

  /**
   * Delete all sessions for a user entity ref
   */
  async deleteSessionsByUserEntityRef(userEntityRef: string): Promise<number> {
    return await this.#knex(OfflineSessionDatabase.TABLE_NAME)
      .where('user_entity_ref', userEntityRef)
      .delete();
  }

  /**
   * Delete a session by OIDC client ID
   */
  async deleteSessionByClientId(oidcClientId: string): Promise<number> {
    return await this.#knex(OfflineSessionDatabase.TABLE_NAME)
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

    return await this.#knex(OfflineSessionDatabase.TABLE_NAME)
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

  /**
   * Enforce per-user limit by deleting oldest sessions (LRU)
   * @internal
   */
  private async enforceUserLimit(
    userEntityRef: string,
    trx: Knex.Transaction,
  ): Promise<void> {
    const userSessions = await trx(OfflineSessionDatabase.TABLE_NAME)
      .where('user_entity_ref', userEntityRef)
      .select('id', 'last_used_at')
      .orderBy('last_used_at', 'asc');

    const tokensToDelete =
      userSessions.length - (OfflineSessionDatabase.MAX_TOKENS_PER_USER - 1);

    if (tokensToDelete > 0) {
      const idsToDelete = userSessions.slice(0, tokensToDelete).map(s => s.id);

      await trx(OfflineSessionDatabase.TABLE_NAME)
        .whereIn('id', idsToDelete)
        .delete();
    }
  }

  /**
   * Map database row to OfflineSession type
   * @internal
   */
  private mapRow(row: any): OfflineSession {
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
 * Parse a duration string to seconds
 * @internal
 */
function parseDurationToSeconds(
  duration: string | { [key: string]: number },
): number {
  if (typeof duration === 'object') {
    // Handle HumanDuration object format
    let seconds = 0;
    if (duration.years) seconds += duration.years * 365 * 24 * 60 * 60;
    if (duration.months) seconds += duration.months * 30 * 24 * 60 * 60;
    if (duration.weeks) seconds += duration.weeks * 7 * 24 * 60 * 60;
    if (duration.days) seconds += duration.days * 24 * 60 * 60;
    if (duration.hours) seconds += duration.hours * 60 * 60;
    if (duration.minutes) seconds += duration.minutes * 60;
    if (duration.seconds) seconds += duration.seconds;
    if (duration.milliseconds) seconds += duration.milliseconds / 1000;
    return seconds;
  }

  // Handle string format like "30 days", "1 year"
  const match = duration.match(
    /^(\d+)\s*(year|years|month|months|week|weeks|day|days|hour|hours|minute|minutes|second|seconds|ms|milliseconds)$/i,
  );
  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 'year':
    case 'years':
      return value * 365 * 24 * 60 * 60;
    case 'month':
    case 'months':
      return value * 30 * 24 * 60 * 60;
    case 'week':
    case 'weeks':
      return value * 7 * 24 * 60 * 60;
    case 'day':
    case 'days':
      return value * 24 * 60 * 60;
    case 'hour':
    case 'hours':
      return value * 60 * 60;
    case 'minute':
    case 'minutes':
      return value * 60;
    case 'second':
    case 'seconds':
      return value;
    case 'ms':
    case 'milliseconds':
      return value / 1000;
    default:
      throw new Error(`Unknown duration unit: ${unit}`);
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
        const tokenLifetime =
          deps.config.getOptionalString('auth.refreshToken.tokenLifetime') ??
          '30 days';
        const maxRotationLifetime =
          deps.config.getOptionalString(
            'auth.refreshToken.maxRotationLifetime',
          ) ?? '1 year';

        const tokenLifetimeSeconds = parseDurationToSeconds(tokenLifetime);
        const maxRotationLifetimeSeconds =
          parseDurationToSeconds(maxRotationLifetime);

        const knex = await deps.database.getClient();

        return OfflineSessionDatabase.create({
          knex,
          tokenLifetimeSeconds,
          maxRotationLifetimeSeconds,
        });
      },
    }),
});

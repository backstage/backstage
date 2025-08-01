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

import { DateTime } from 'luxon';
import { Knex } from 'knex';
import { createHash } from 'crypto';
import { v4 as uuid } from 'uuid';

import { AuthDatabase } from './AuthDatabase';
import { JsonObject } from '@backstage/types';

const TABLE = 'refresh_sessions';

type Row = {
  session_id: string;
  user_entity_ref: string;
  token_hash: string;
  session_data: string;
  created_at: string;
  expires_at: string;
  last_used_at?: string;
  revoked: boolean;
};

export type RefreshSessionData = {
  sessionId: string;
  userEntityRef: string;
  claims: JsonObject;
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt?: Date;
  revoked: boolean;
};

export type CreateRefreshSessionOptions = {
  userEntityRef: string;
  claims: JsonObject;
  expiresAt: Date;
};

export class RefreshSessionDatabase {
  private constructor(private readonly client: Knex) {}

  /**
   * Create a new refresh session and return the session data with generated token
   */
  async createRefreshSession(
    options: CreateRefreshSessionOptions,
  ): Promise<{ sessionData: RefreshSessionData; refreshToken: string }> {
    const sessionId = uuid();
    const refreshToken = this.generateRefreshToken();
    const tokenHash = this.hashToken(refreshToken);

    const sessionData: RefreshSessionData = {
      sessionId,
      userEntityRef: options.userEntityRef,
      claims: options.claims,
      createdAt: new Date(),
      expiresAt: options.expiresAt,
      revoked: false,
    };

    await this.client<Row>(TABLE).insert({
      session_id: sessionId,
      user_entity_ref: options.userEntityRef,
      token_hash: tokenHash,
      session_data: JSON.stringify(sessionData),
      created_at: DateTime.utc().toSQL({ includeOffset: false }),
      expires_at: DateTime.fromJSDate(options.expiresAt).toSQL({
        includeOffset: false,
      }),
      revoked: false,
    });

    return { sessionData, refreshToken };
  }

  /**
   * Retrieve and validate a refresh session by token
   */
  async getRefreshSession(
    refreshToken: string,
  ): Promise<RefreshSessionData | undefined> {
    const tokenHash = this.hashToken(refreshToken);

    const row = await this.client<Row>(TABLE)
      .where({ token_hash: tokenHash, revoked: false })
      .andWhere('expires_at', '>', DateTime.utc().toSQL({ includeOffset: false }))
      .first();

    if (!row) {
      return undefined;
    }

    const sessionData: RefreshSessionData = JSON.parse(row.session_data);
    return {
      ...sessionData,
      createdAt: new Date(row.created_at),
      expiresAt: new Date(row.expires_at),
      lastUsedAt: row.last_used_at ? new Date(row.last_used_at) : undefined,
    };
  }

  /**
   * Update the last used timestamp for a refresh session
   */
  async updateLastUsed(refreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(refreshToken);

    await this.client<Row>(TABLE)
      .where({ token_hash: tokenHash })
      .update({
        last_used_at: DateTime.utc().toSQL({ includeOffset: false }),
      });
  }

  /**
   * Revoke a refresh session by token
   */
  async revokeRefreshSession(refreshToken: string): Promise<boolean> {
    const tokenHash = this.hashToken(refreshToken);

    const result = await this.client<Row>(TABLE)
      .where({ token_hash: tokenHash })
      .update({ revoked: true });

    return result > 0;
  }

  /**
   * Revoke all refresh sessions for a user
   */
  async revokeAllUserSessions(userEntityRef: string): Promise<number> {
    const result = await this.client<Row>(TABLE)
      .where({ user_entity_ref: userEntityRef })
      .update({ revoked: true });

    return result;
  }

  /**
   * Get all active refresh sessions for a user
   */
  async getUserSessions(userEntityRef: string): Promise<RefreshSessionData[]> {
    const rows = await this.client<Row>(TABLE)
      .where({ user_entity_ref: userEntityRef, revoked: false })
      .andWhere('expires_at', '>', DateTime.utc().toSQL({ includeOffset: false }))
      .orderBy('created_at', 'desc');

    return rows.map(row => {
      const sessionData: RefreshSessionData = JSON.parse(row.session_data);
      return {
        ...sessionData,
        createdAt: new Date(row.created_at),
        expiresAt: new Date(row.expires_at),
        lastUsedAt: row.last_used_at ? new Date(row.last_used_at) : undefined,
      };
    });
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await this.client<Row>(TABLE)
      .where('expires_at', '<', DateTime.utc().toSQL({ includeOffset: false }))
      .del();

    return result;
  }

  private generateRefreshToken(): string {
    // Generate a cryptographically secure random token
    // Using a longer token than typical session tokens for additional security
    const randomBytes = require('crypto').randomBytes(48);
    return `bsr_${randomBytes.toString('base64url')}`; // backstage refresh token prefix
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  static async create(options: { database: AuthDatabase }) {
    const client = await options.database.get();
    return new RefreshSessionDatabase(client);
  }
}
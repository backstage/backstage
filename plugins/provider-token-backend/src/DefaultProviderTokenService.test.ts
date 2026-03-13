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

import { TestDatabases, mockServices } from '@backstage/backend-test-utils';
import { deriveKey } from './crypto';
import { DefaultProviderTokenService } from './DefaultProviderTokenService';

jest.setTimeout(60_000);

const SECRET = Buffer.from('test-secret-at-least-32-bytes-longgg').toString(
  'base64',
);

const databases = TestDatabases.create();

async function createService(databaseId = 'SQLITE_3' as const) {
  const knex = await databases.init(databaseId);
  await knex.migrate.latest({
    directory: require('node:path').resolve(__dirname, '../migrations'),
  });
  const encKey = deriveKey(SECRET);
  const refreshers = new Map();
  return {
    knex,
    service: new DefaultProviderTokenService(
      knex,
      encKey,
      refreshers,
      300,
      mockServices.logger.mock(),
    ),
  };
}

describe('DefaultProviderTokenService', () => {
  describe('upsertToken', () => {
    it('stores a token and getToken retrieves it', async () => {
      const { service } = await createService();
      await service.upsertToken('user:default/alice', 'atlassian', {
        accessToken: 'at-abc',
        refreshToken: 'rt-xyz',
        scope: 'read:me offline_access',
        expiresInSeconds: 3600,
      });
      const token = await service.getToken('user:default/alice', 'atlassian');
      expect(token).toBeDefined();
      expect(token!.accessToken).toBe('at-abc');
      // refreshToken is intentionally absent from ProviderToken — action handlers must not see it
      expect(token!.scope).toBe('read:me offline_access');
      expect(token!.expiresAt).toBeInstanceOf(Date);
    });

    it('upserts — second call replaces the first', async () => {
      const { service } = await createService();
      await service.upsertToken('user:default/alice', 'atlassian', {
        accessToken: 'old-at',
        expiresInSeconds: 3600,
      });
      await service.upsertToken('user:default/alice', 'atlassian', {
        accessToken: 'new-at',
        expiresInSeconds: 7200,
      });
      const token = await service.getToken('user:default/alice', 'atlassian');
      expect(token!.accessToken).toBe('new-at');
    });

    it('stores tokens encrypted (DB rows contain no plaintext tokens)', async () => {
      const { service, knex } = await createService();
      await service.upsertToken('user:default/alice', 'github', {
        accessToken: 'plaintext-at',
        scope: 'read:user',
      });
      const row = await knex('provider_tokens')
        .where({ user_entity_ref: 'user:default/alice', provider_id: 'github' })
        .first();
      expect(row.access_token).not.toBe('plaintext-at');
      expect(row.access_token).toMatch(/^v1:/);
      expect(row.scope).not.toBe('read:user');
      expect(row.scope).toMatch(/^v1:/);
    });
  });

  describe('getToken', () => {
    it('returns undefined when no token stored', async () => {
      const { service } = await createService();
      const result = await service.getToken('user:default/nobody', 'atlassian');
      expect(result).toBeUndefined();
    });

    it('returns undefined when token is expired and no refresh token', async () => {
      const { service, knex } = await createService();
      await service.upsertToken('user:default/alice', 'atlassian', {
        accessToken: 'expired-at',
        expiresInSeconds: -1, // already expired
      });
      // Ensure expiresAt is in the past
      await knex('provider_tokens')
        .where({
          user_entity_ref: 'user:default/alice',
          provider_id: 'atlassian',
        })
        .update({ expires_at: new Date(Date.now() - 10000) });
      const result = await service.getToken('user:default/alice', 'atlassian');
      expect(result).toBeUndefined();
    });

    it('returns token when no expiry set (no-expiry tokens)', async () => {
      const { service } = await createService();
      await service.upsertToken('user:default/alice', 'github', {
        accessToken: 'github-token',
      });
      const result = await service.getToken('user:default/alice', 'github');
      expect(result).toBeDefined();
      expect(result!.accessToken).toBe('github-token');
    });
  });

  describe('deleteToken', () => {
    it('removes a specific user+provider row', async () => {
      const { service } = await createService();
      await service.upsertToken('user:default/alice', 'atlassian', {
        accessToken: 'at',
      });
      await service.deleteToken('user:default/alice', 'atlassian');
      const result = await service.getToken('user:default/alice', 'atlassian');
      expect(result).toBeUndefined();
    });
  });

  describe('deleteTokens', () => {
    it('removes all tokens for a user across providers', async () => {
      const { service } = await createService();
      await service.upsertToken('user:default/alice', 'atlassian', {
        accessToken: 'at1',
      });
      await service.upsertToken('user:default/alice', 'github', {
        accessToken: 'at2',
      });
      await service.deleteTokens('user:default/alice');
      expect(
        await service.getToken('user:default/alice', 'atlassian'),
      ).toBeUndefined();
      expect(
        await service.getToken('user:default/alice', 'github'),
      ).toBeUndefined();
    });

    it('does not delete tokens for other users', async () => {
      const { service } = await createService();
      await service.upsertToken('user:default/alice', 'atlassian', {
        accessToken: 'alice-at',
      });
      await service.upsertToken('user:default/bob', 'atlassian', {
        accessToken: 'bob-at',
      });
      await service.deleteTokens('user:default/alice');
      expect(
        await service.getToken('user:default/bob', 'atlassian'),
      ).toBeDefined();
    });
  });

  describe('refresh deduplication (thundering-herd prevention)', () => {
    it('calls refresher exactly once when 5 concurrent getToken calls hit an expiring token', async () => {
      const { service, knex } = await createService();

      const mockRefresher = {
        providerId: 'atlassian',
        refresh: jest.fn().mockResolvedValue({
          accessToken: 'refreshed-at',
          refreshToken: 'refreshed-rt',
          expiresInSeconds: 3600,
        }),
      };
      // Replace the empty refreshers map with one containing our mock
      (service as any).refreshers = new Map([['atlassian', mockRefresher]]);

      await service.upsertToken('user:default/alice', 'atlassian', {
        accessToken: 'expiring-at',
        refreshToken: 'rt-to-use',
        expiresInSeconds: 1, // 1 second — within default 300s buffer
      });
      // Force expiry to trigger refresh path
      await knex('provider_tokens')
        .where({
          user_entity_ref: 'user:default/alice',
          provider_id: 'atlassian',
        })
        .update({ expires_at: new Date(Date.now() - 1000) });

      // Fire 5 concurrent getToken calls
      const results = await Promise.all(
        Array.from({ length: 5 }, () =>
          service.getToken('user:default/alice', 'atlassian'),
        ),
      );

      // All calls succeed
      for (const r of results) {
        expect(r).toBeDefined();
        expect(r!.accessToken).toBe('refreshed-at');
      }

      // Refresh was called exactly once — not 5 times
      expect(mockRefresher.refresh).toHaveBeenCalledTimes(1);
    });

    it('returns undefined when refresher throws', async () => {
      const { service, knex } = await createService();

      const mockRefresher = {
        providerId: 'atlassian',
        refresh: jest
          .fn()
          .mockRejectedValue(new Error('Atlassian token endpoint unreachable')),
      };
      (service as any).refreshers = new Map([['atlassian', mockRefresher]]);

      await service.upsertToken('user:default/alice', 'atlassian', {
        accessToken: 'expiring-at',
        refreshToken: 'stale-rt',
        expiresInSeconds: 1,
      });
      await knex('provider_tokens')
        .where({
          user_entity_ref: 'user:default/alice',
          provider_id: 'atlassian',
        })
        .update({ expires_at: new Date(Date.now() - 1000) });

      const result = await service.getToken('user:default/alice', 'atlassian');
      expect(result).toBeUndefined();
    });
  });
});

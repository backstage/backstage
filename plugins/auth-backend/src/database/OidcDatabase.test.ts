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
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { AuthDatabase } from './AuthDatabase';
import { OidcDatabase } from './OidcDatabase';
import { resolvePackagePath } from '@backstage/backend-plugin-api';

describe('Oidc Database', () => {
  const databases = TestDatabases.create();

  async function createOidcDatabase(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);

    await knex.migrate.latest({
      directory: resolvePackagePath(
        '@backstage/plugin-auth-backend',
        'migrations',
      ),
    });

    return {
      oidc: await OidcDatabase.create({
        database: AuthDatabase.create({
          getClient: async () => knex,
        }),
      }),
    };
  }

  describe.each(databases.eachSupportedId())('%p', databaseId => {
    describe('Client', () => {
      it('should create and return a client', async () => {
        const { oidc } = await createOidcDatabase(databaseId);

        await expect(
          oidc.createClient({
            clientId: 'test-client',
            clientName: 'Test Client',
            clientSecret: 'test-secret',
            redirectUris: ['https://example.com/callback'],
            responseTypes: ['code'],
            grantTypes: ['authorization_code'],
          }),
        ).resolves.toEqual({
          clientId: 'test-client',
          clientName: 'Test Client',
          clientSecret: 'test-secret',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
          scope: undefined,
          expiresAt: undefined,
          metadata: undefined,
          createdAt: expect.any(String),
        });
      });

      it('should return the client thats created in a list', async () => {
        const { oidc } = await createOidcDatabase(databaseId);

        const client = await oidc.createClient({
          clientId: 'test-client',
          clientName: 'Test Client',
          clientSecret: 'test-secret',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
        });

        await expect(
          oidc.getClient({ clientId: 'test-client' }),
        ).resolves.toEqual(client);
      });

      it('should return null if the client does not exist', async () => {
        const { oidc } = await createOidcDatabase(databaseId);

        await expect(
          oidc.getClient({ clientId: 'test-client' }),
        ).resolves.toBeNull();
      });
    });

    describe('Authorization Code', () => {
      it('should create and return an authorization code', async () => {
        const { oidc } = await createOidcDatabase(databaseId);

        const mockClient = await oidc.createClient({
          clientId: 'test-client',
          clientName: 'Test Client',
          clientSecret: 'test-secret',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
        });

        const authorizationCode = await oidc.createAuthorizationCode({
          code: 'test-code',
          clientId: mockClient.clientId,
          userEntityRef: 'user:default/blam',
          redirectUri: 'https://example.com/callback',
          scope: undefined,
          codeChallenge: 'test-challenge',
          codeChallengeMethod: 'S256',
          nonce: 'test-nonce',
          expiresAt: '2025-01-01',
        });

        await expect(
          oidc.getAuthorizationCode({ code: 'test-code' }),
        ).resolves.toEqual(authorizationCode);
      });

      it('should return null if the authorization code does not exist', async () => {
        const { oidc } = await createOidcDatabase(databaseId);

        await expect(
          oidc.getAuthorizationCode({ code: 'test-code' }),
        ).resolves.toBeNull();
      });

      it('should return the authorization code when created', async () => {
        const { oidc } = await createOidcDatabase(databaseId);

        const mockClient = await oidc.createClient({
          clientId: 'test-client',
          clientName: 'Test Client',
          clientSecret: 'test-secret',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
        });

        const authorizationCode = await oidc.createAuthorizationCode({
          code: 'test-code',
          clientId: mockClient.clientId,
          userEntityRef: 'user:default/blam',
          redirectUri: 'https://example.com/callback',
          scope: undefined,
          codeChallenge: 'test-challenge',
          codeChallengeMethod: 'S256',
          nonce: 'test-nonce',
          expiresAt: '2025-01-01',
        });

        await expect(
          oidc.getAuthorizationCode({ code: 'test-code' }),
        ).resolves.toEqual(authorizationCode);
      });

      it('should allow updating the authorization code', async () => {
        const { oidc } = await createOidcDatabase(databaseId);

        const mockClient = await oidc.createClient({
          clientId: 'test-client',
          clientName: 'Test Client',
          clientSecret: 'test-secret',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
        });

        const authorizationCode = await oidc.createAuthorizationCode({
          code: 'test-code',
          clientId: mockClient.clientId,
          userEntityRef: 'user:default/blam',
          redirectUri: 'https://example.com/callback',
          codeChallenge: 'test-challenge',
          codeChallengeMethod: 'S256',
          nonce: 'test-nonce',
          expiresAt: '2025-01-01',
        });

        await expect(
          oidc.updateAuthorizationCode({
            code: 'test-code',
            used: true,
          }),
        ).resolves.toEqual({
          ...authorizationCode,
          used: true,
        });
      });
    });
  });
});

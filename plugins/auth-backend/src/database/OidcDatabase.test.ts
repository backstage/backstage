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

jest.setTimeout(60_000);

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
    describe('Clients', () => {
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

    describe('Authorization Sessions', () => {
      it('should create and return an authorization session', async () => {
        const { oidc } = await createOidcDatabase(databaseId);

        const client = await oidc.createClient({
          clientId: 'test-client',
          clientName: 'Test Client',
          clientSecret: 'test-secret',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
        });

        const session = await oidc.createAuthorizationSession({
          id: 'test-session',
          clientId: client.clientId,
          userEntityRef: 'user:default/blam',
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          scope: 'openid',
          state: 'test-state',
          codeChallenge: 'test-challenge',
          codeChallengeMethod: 'S256',
          nonce: 'test-nonce',
          expiresAt: new Date('2025-01-01T00:00:00Z'),
        });

        expect(session).toEqual(
          expect.objectContaining({
            id: 'test-session',
            clientId: client.clientId,
            userEntityRef: 'user:default/blam',
            redirectUri: 'https://example.com/callback',
            responseType: 'code',
            scope: 'openid',
            state: 'test-state',
            codeChallenge: 'test-challenge',
            codeChallengeMethod: 'S256',
            nonce: 'test-nonce',
            expiresAt: new Date('2025-01-01T00:00:00Z'),
            status: 'pending',
          }),
        );
      });

      it('should allow updating the authorization session', async () => {
        const { oidc } = await createOidcDatabase(databaseId);

        const client = await oidc.createClient({
          clientId: 'test-client',
          clientName: 'Test Client',
          clientSecret: 'test-secret',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
        });

        const session = await oidc.createAuthorizationSession({
          id: 'test-session',
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          expiresAt: new Date('2025-01-01T00:00:00Z'),
        });

        await expect(
          oidc.updateAuthorizationSession({
            id: 'test-session',
            userEntityRef: 'user:default/blam',
            status: 'approved',
          }),
        ).resolves.toEqual({
          ...session,
          userEntityRef: 'user:default/blam',
          status: 'approved',
        });
      });
    });

    describe('Authorization Codes', () => {
      it('should create and return an authorization code', async () => {
        const { oidc } = await createOidcDatabase(databaseId);

        const client = await oidc.createClient({
          clientId: 'test-client',
          clientName: 'Test Client',
          clientSecret: 'test-secret',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
        });

        const session = await oidc.createAuthorizationSession({
          id: 'test-session',
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          expiresAt: new Date('2025-01-01T00:00:00Z'),
        });

        const authCode = await oidc.createAuthorizationCode({
          code: 'test-code',
          sessionId: session.id,
          expiresAt: new Date('2025-01-01T00:00:00Z'),
        });

        expect(authCode).toEqual(
          expect.objectContaining({
            code: 'test-code',
            sessionId: session.id,
            expiresAt: new Date('2025-01-01T00:00:00Z'),
          }),
        );
      });

      it('should return authorization code with session data', async () => {
        const { oidc } = await createOidcDatabase(databaseId);

        const client = await oidc.createClient({
          clientId: 'test-client',
          clientName: 'Test Client',
          clientSecret: 'test-secret',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
        });

        const session = await oidc.createAuthorizationSession({
          id: 'test-session',
          clientId: client.clientId,
          userEntityRef: 'user:default/blam',
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          scope: 'openid',
          codeChallenge: 'test-challenge',
          codeChallengeMethod: 'S256',
          nonce: 'test-nonce',
          expiresAt: new Date('2025-01-01T00:00:00Z'),
        });

        const authCode = await oidc.createAuthorizationCode({
          code: 'test-code',
          sessionId: session.id,
          expiresAt: new Date('2025-01-01T00:00:00Z'),
        });

        const authCodeFromDb = await oidc.getAuthorizationCode({
          code: 'test-code',
        });
        const sessionFromDb = await oidc.getAuthorizationSession({
          id: authCodeFromDb!.sessionId,
        });

        expect(authCodeFromDb).toEqual(authCode);
        expect(sessionFromDb).toEqual(session);
      });

      it('should allow updating the authorization code', async () => {
        const { oidc } = await createOidcDatabase(databaseId);

        const client = await oidc.createClient({
          clientId: 'test-client',
          clientName: 'Test Client',
          clientSecret: 'test-secret',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
        });

        const session = await oidc.createAuthorizationSession({
          id: 'test-session',
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          expiresAt: new Date('2025-01-01T00:00:00Z'),
        });

        const authCode = await oidc.createAuthorizationCode({
          code: 'test-code',
          sessionId: session.id,
          expiresAt: new Date('2025-01-01T00:00:00Z'),
        });

        const updatedAuthCode = await oidc.updateAuthorizationCode({
          code: 'test-code',
          used: true,
        });

        expect(updatedAuthCode).toEqual({
          ...authCode,
          used: true,
        });
      });
    });
  });
});

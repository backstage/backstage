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
import {
  mockServices,
  TestDatabaseId,
  TestDatabases,
} from '@backstage/backend-test-utils';
import { OidcService } from './OidcService';
import {
  BackstageCredentials,
  BackstageServicePrincipal,
  BackstageUserPrincipal,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { AuthDatabase } from '../database/AuthDatabase';
import { OidcDatabase } from '../database/OidcDatabase';
import { UserInfoDatabase } from '../database/UserInfoDatabase';
import { InputError, AuthenticationError } from '@backstage/errors';
import crypto from 'crypto';
import { AnyJWK, TokenIssuer } from '../identity/types';

describe('OidcService', () => {
  const databases = TestDatabases.create();

  async function createOidcService(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);

    await knex.migrate.latest({
      directory: resolvePackagePath(
        '@backstage/plugin-auth-backend',
        'migrations',
      ),
    });

    const oidcDatabase = await OidcDatabase.create({
      database: AuthDatabase.create({
        getClient: async () => knex,
      }),
    });

    const mockAuth = mockServices.auth.mock();
    const mockTokenIssuer = {
      issueToken: jest.fn(),
      listPublicKeys: jest.fn(),
    } as jest.Mocked<TokenIssuer>;

    const mockUserInfo = {
      addUserInfo: jest.fn(),
      getUserInfo: jest.fn(),
    } as unknown as jest.Mocked<UserInfoDatabase>;

    return {
      service: OidcService.create({
        auth: mockAuth,
        tokenIssuer: mockTokenIssuer,
        baseUrl: 'http://mock-base-url',
        userInfo: mockUserInfo,
        oidc: oidcDatabase,
      }),
      mocks: {
        auth: mockAuth,
        tokenIssuer: mockTokenIssuer,
        userInfo: mockUserInfo,
      },
    };
  }

  describe.each(databases.eachSupportedId())('%p', databaseId => {
    describe('getConfiguration', () => {
      it('should return OIDC configuration', async () => {
        const { service } = await createOidcService(databaseId);

        const config = service.getConfiguration();

        expect(config).toEqual({
          issuer: 'http://mock-base-url',
          token_endpoint: 'http://mock-base-url/v1/token',
          userinfo_endpoint: 'http://mock-base-url/v1/userinfo',
          jwks_uri: 'http://mock-base-url/.well-known/jwks.json',
          response_types_supported: ['code', 'id_token'],
          subject_types_supported: ['public'],
          id_token_signing_alg_values_supported: [
            'RS256',
            'RS384',
            'RS512',
            'ES256',
            'ES384',
            'ES512',
            'PS256',
            'PS384',
            'PS512',
            'EdDSA',
          ],
          scopes_supported: ['openid'],
          token_endpoint_auth_methods_supported: [
            'client_secret_basic',
            'client_secret_post',
          ],
          claims_supported: ['sub', 'ent'],
          grant_types_supported: ['authorization_code'],
          authorization_endpoint: 'http://mock-base-url/v1/authorize',
          registration_endpoint: 'http://mock-base-url/v1/register',
          code_challenge_methods_supported: ['S256', 'plain'],
        });
      });
    });

    describe('listPublicKeys', () => {
      it('should return public keys from token issuer', async () => {
        const { service, mocks } = await createOidcService(databaseId);
        const mockKeys = [{ kid: 'key-1', use: 'sig' }] as AnyJWK[];
        mocks.tokenIssuer.listPublicKeys.mockResolvedValue({ keys: mockKeys });

        const { keys } = await service.listPublicKeys();

        expect(keys).toEqual(mockKeys);
        expect(mocks.tokenIssuer.listPublicKeys).toHaveBeenCalledTimes(1);
      });
    });

    describe('getUserInfo', () => {
      it('should return user info for valid token', async () => {
        const { service, mocks } = await createOidcService(databaseId);
        const mockCredentials: BackstageCredentials<BackstageUserPrincipal> = {
          principal: {
            type: 'user',
            userEntityRef: 'user:default/test',
          },
          $$type: '@backstage/BackstageCredentials',
        };
        const mockUserInfo = { sub: 'user:default/test', name: 'Test User' };

        mocks.auth.authenticate.mockResolvedValue(mockCredentials);
        mocks.auth.isPrincipal.mockReturnValue(true);
        mocks.userInfo.getUserInfo.mockResolvedValue({
          claims: mockUserInfo,
        });

        const mockToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyOmRlZmF1bHQvdGVzdCJ9.signature';

        const userInfo = await service.getUserInfo({ token: mockToken });

        expect(userInfo).toEqual({
          claims: mockUserInfo,
        });

        expect(mocks.auth.authenticate).toHaveBeenCalledWith(mockToken, {
          allowLimitedAccess: true,
        });

        expect(mocks.userInfo.getUserInfo).toHaveBeenCalledWith(
          'user:default/test',
        );
      });

      it('should throw error for non-user principal', async () => {
        const { service, mocks } = await createOidcService(databaseId);
        const mockCredentials: BackstageCredentials<BackstageServicePrincipal> =
          {
            principal: {
              type: 'service',
              subject: 'test-service',
            },
            $$type: '@backstage/BackstageCredentials',
          };

        mocks.auth.authenticate.mockResolvedValue(mockCredentials);
        mocks.auth.isPrincipal.mockReturnValue(false);

        const mockToken =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyOmRlZmF1bHQvdGVzdCJ9.signature';

        await expect(service.getUserInfo({ token: mockToken })).rejects.toThrow(
          'Userinfo endpoint must be called with a token that represents a user principal',
        );
      });
    });

    describe('registerClient', () => {
      it('should create a new client with generated credentials', async () => {
        const { service } = await createOidcService(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
          scope: 'openid',
        });

        expect(client).toEqual(
          expect.objectContaining({
            clientName: 'Test Client',
            redirectUris: ['https://example.com/callback'],
            responseTypes: ['code'],
            grantTypes: ['authorization_code'],
            scope: 'openid',
          }),
        );
        expect(client.clientId).toBeDefined();
        expect(client.clientSecret).toBeDefined();
      });

      it('should create a client with default values', async () => {
        const { service } = await createOidcService(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
        });

        expect(client).toEqual(
          expect.objectContaining({
            clientName: 'Test Client',
            redirectUris: [],
            responseTypes: ['code'],
            grantTypes: ['authorization_code'],
          }),
        );
      });
    });

    describe('createConsentRequest', () => {
      it('should create a consent request for valid client', async () => {
        const { service } = await createOidcService(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const consent = await service.createConsentRequest({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          scope: 'openid',
          state: 'test-state',
        });

        expect(consent).toEqual({
          consentRequestId: expect.any(String),
          clientName: 'Test Client',
          scope: 'openid',
          redirectUri: 'https://example.com/callback',
        });
      });

      it('should throw error for invalid client', async () => {
        const { service } = await createOidcService(databaseId);

        await expect(
          service.createConsentRequest({
            clientId: 'invalid-client',
            redirectUri: 'https://example.com/callback',
            responseType: 'code',
          }),
        ).rejects.toThrow('Invalid client_id');
      });

      it('should throw error for invalid redirect URI', async () => {
        const { service } = await createOidcService(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        await expect(
          service.createConsentRequest({
            clientId: client.clientId,
            redirectUri: 'https://invalid.com/callback',
            responseType: 'code',
          }),
        ).rejects.toThrow('Invalid redirect_uri');
      });

      it('should throw error for unsupported response type', async () => {
        const { service } = await createOidcService(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        await expect(
          service.createConsentRequest({
            clientId: client.clientId,
            redirectUri: 'https://example.com/callback',
            responseType: 'token',
          }),
        ).rejects.toThrow('Only authorization code flow is supported');
      });

      it('should handle PKCE parameters', async () => {
        const { service } = await createOidcService(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const consent = await service.createConsentRequest({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          codeChallenge: 'test-challenge',
          codeChallengeMethod: 'S256',
        });

        expect(consent.consentRequestId).toBeDefined();
      });

      it('should throw error for invalid PKCE method', async () => {
        const { service } = await createOidcService(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        await expect(
          service.createConsentRequest({
            clientId: client.clientId,
            redirectUri: 'https://example.com/callback',
            responseType: 'code',
            codeChallenge: 'test-challenge',
            codeChallengeMethod: 'invalid',
          }),
        ).rejects.toThrow('Invalid code_challenge_method');
      });
    });

    describe('approveConsentRequest', () => {
      it('should approve a valid consent request', async () => {
        const { service } = await createOidcService(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const consent = await service.createConsentRequest({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          state: 'test-state',
        });

        const result = await service.approveConsentRequest({
          consentRequestId: consent.consentRequestId,
          userEntityRef: 'user:default/test',
        });

        expect(result.redirectUrl).toMatch(
          /^https:\/\/example\.com\/callback\?code=.+&state=test-state$/,
        );
      });

      it('should throw error for invalid consent request', async () => {
        const { service } = await createOidcService(databaseId);

        await expect(
          service.approveConsentRequest({
            consentRequestId: 'invalid-consent',
            userEntityRef: 'user:default/test',
          }),
        ).rejects.toThrow('Invalid consent request');
      });
    });

    describe('getConsentRequest', () => {
      it('should return consent request details', async () => {
        const { service } = await createOidcService(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const consent = await service.createConsentRequest({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          scope: 'openid',
          state: 'test-state',
        });

        const details = await service.getConsentRequest({
          consentRequestId: consent.consentRequestId,
        });

        expect(details).toEqual(
          expect.objectContaining({
            id: consent.consentRequestId,
            clientId: client.clientId,
            clientName: 'Test Client',
            redirectUri: 'https://example.com/callback',
            scope: 'openid',
            state: 'test-state',
            responseType: 'code',
          }),
        );
      });
    });

    describe('deleteConsentRequest', () => {
      it('should delete a consent request', async () => {
        const { service } = await createOidcService(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const consent = await service.createConsentRequest({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
        });

        await service.deleteConsentRequest({
          consentRequestId: consent.consentRequestId,
        });

        await expect(
          service.getConsentRequest({
            consentRequestId: consent.consentRequestId,
          }),
        ).rejects.toThrow('Invalid consent request');
      });

      it('should handle deleting non-existent consent request', async () => {
        const { service } = await createOidcService(databaseId);

        await expect(
          service.deleteConsentRequest({
            consentRequestId: 'non-existent',
          }),
        ).resolves.not.toThrow();
      });
    });

    describe('authorize', () => {
      it('should create direct authorization', async () => {
        const { service } = await createOidcService(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const result = await service.authorize({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          userEntityRef: 'user:default/test',
          state: 'test-state',
        });

        expect(result.redirectUrl).toMatch(
          /^https:\/\/example\.com\/callback\?code=.+&state=test-state$/,
        );
      });

      it('should throw error for invalid client', async () => {
        const { service } = await createOidcService(databaseId);

        await expect(
          service.authorize({
            clientId: 'invalid-client',
            redirectUri: 'https://example.com/callback',
            responseType: 'code',
            userEntityRef: 'user:default/test',
          }),
        ).rejects.toThrow('Invalid client_id');
      });
    });

    describe('exchangeCodeForToken', () => {
      it('should exchange valid code for tokens', async () => {
        const { service, mocks } = await createOidcService(databaseId);
        const mockToken = 'mock-jwt-token';
        mocks.tokenIssuer.issueToken.mockResolvedValue({ token: mockToken });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const authResult = await service.authorize({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          userEntityRef: 'user:default/test',
          scope: 'openid',
        });

        const code = new URL(authResult.redirectUrl).searchParams.get('code')!;

        const tokenResult = await service.exchangeCodeForToken({
          code,
          clientId: client.clientId,
          clientSecret: client.clientSecret,
          redirectUri: 'https://example.com/callback',
          grantType: 'authorization_code',
        });

        expect(tokenResult).toEqual({
          accessToken: mockToken,
          tokenType: 'Bearer',
          expiresIn: 3600,
          idToken: mockToken,
          scope: 'openid',
        });
      });

      it('should throw error for invalid grant type', async () => {
        const { service } = await createOidcService(databaseId);

        await expect(
          service.exchangeCodeForToken({
            code: 'test-code',
            clientId: 'test-client',
            clientSecret: 'test-secret',
            redirectUri: 'https://example.com/callback',
            grantType: 'client_credentials',
          }),
        ).rejects.toThrow('Unsupported grant type');
      });

      it('should throw error for invalid client', async () => {
        const { service } = await createOidcService(databaseId);

        await expect(
          service.exchangeCodeForToken({
            code: 'test-code',
            clientId: 'invalid-client',
            clientSecret: 'test-secret',
            redirectUri: 'https://example.com/callback',
            grantType: 'authorization_code',
          }),
        ).rejects.toThrow('Invalid client');
      });

      it('should throw error for invalid client secret', async () => {
        const { service } = await createOidcService(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        await expect(
          service.exchangeCodeForToken({
            code: 'test-code',
            clientId: client.clientId,
            clientSecret: 'invalid-secret',
            redirectUri: 'https://example.com/callback',
            grantType: 'authorization_code',
          }),
        ).rejects.toThrow('Invalid client credentials');
      });

      it('should handle PKCE verification', async () => {
        const { service, mocks } = await createOidcService(databaseId);
        const mockToken = 'mock-jwt-token';
        mocks.tokenIssuer.issueToken.mockResolvedValue({ token: mockToken });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const codeVerifier = 'test-code-verifier';
        const codeChallenge = crypto
          .createHash('sha256')
          .update(codeVerifier)
          .digest('base64url');

        const authResult = await service.authorize({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          userEntityRef: 'user:default/test',
          codeChallenge,
          codeChallengeMethod: 'S256',
        });

        const code = new URL(authResult.redirectUrl).searchParams.get('code')!;

        const tokenResult = await service.exchangeCodeForToken({
          code,
          clientId: client.clientId,
          clientSecret: client.clientSecret,
          redirectUri: 'https://example.com/callback',
          grantType: 'authorization_code',
          codeVerifier,
        });

        expect(tokenResult.accessToken).toBe(mockToken);
      });

      it('should throw error for invalid PKCE verifier', async () => {
        const { service } = await createOidcService(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const codeChallenge = 'test-challenge';
        const authResult = await service.authorize({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          userEntityRef: 'user:default/test',
          codeChallenge,
          codeChallengeMethod: 'S256',
        });

        const code = new URL(authResult.redirectUrl).searchParams.get('code')!;

        await expect(
          service.exchangeCodeForToken({
            code,
            clientId: client.clientId,
            clientSecret: client.clientSecret,
            redirectUri: 'https://example.com/callback',
            grantType: 'authorization_code',
            codeVerifier: 'invalid-verifier',
          }),
        ).rejects.toThrow('Invalid code verifier');
      });
    });
  });
});

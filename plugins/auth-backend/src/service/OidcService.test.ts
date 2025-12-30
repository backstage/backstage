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
import { JsonObject } from '@backstage/types';
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
import crypto from 'node:crypto';
import { AnyJWK, TokenIssuer } from '../identity/types';
import { CimdClientInfo } from './CimdClient';

jest.mock('./CimdClient', () => ({
  ...jest.requireActual('./CimdClient'),
  fetchCimdMetadata: jest.fn(),
}));

import * as CimdClient from './CimdClient';

const mockFetchCimdMetadata =
  CimdClient.fetchCimdMetadata as jest.MockedFunction<
    typeof CimdClient.fetchCimdMetadata
  >;

jest.setTimeout(60_000);

describe('OidcService', () => {
  const databases = TestDatabases.create();

  interface CreateOidcServiceOptions {
    databaseId: TestDatabaseId;
    config?: JsonObject;
  }

  async function createOidcService(options: CreateOidcServiceOptions) {
    const { databaseId, config: configData = {} } = options;

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

    const config = mockServices.rootConfig({ data: configData });

    return {
      service: OidcService.create({
        auth: mockAuth,
        tokenIssuer: mockTokenIssuer,
        baseUrl: 'http://mock-base-url',
        userInfo: mockUserInfo,
        oidc: oidcDatabase,
        config,
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
        const { service } = await createOidcService({ databaseId });

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
          code_challenge_methods_supported: ['S256', 'plain'],
        });
      });
    });

    describe('listPublicKeys', () => {
      it('should return public keys from token issuer', async () => {
        const { service, mocks } = await createOidcService({ databaseId });
        const mockKeys = [{ kid: 'key-1', use: 'sig' }] as AnyJWK[];
        mocks.tokenIssuer.listPublicKeys.mockResolvedValue({ keys: mockKeys });

        const { keys } = await service.listPublicKeys();

        expect(keys).toEqual(mockKeys);
        expect(mocks.tokenIssuer.listPublicKeys).toHaveBeenCalledTimes(1);
      });
    });

    describe('getUserInfo', () => {
      it('should return user info for valid token', async () => {
        const { service, mocks } = await createOidcService({ databaseId });
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
        const { service, mocks } = await createOidcService({ databaseId });
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
        const { service } = await createOidcService({ databaseId });

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

      it('should throw an error for invalid redirect URI', async () => {
        const { service } = await createOidcService({
          databaseId,
          config: {
            auth: {
              experimentalDynamicClientRegistration: {
                allowedRedirectUriPatterns: ['https://example.com/*'],
              },
            },
          },
        });

        await expect(
          service.registerClient({
            clientName: 'Test Client',
            redirectUris: ['https://invalid.com/callback'],
          }),
        ).rejects.toThrow('Invalid redirect_uri');
      });

      it('should create a new client with valid redirect URI', async () => {
        const { service } = await createOidcService({
          databaseId,
          config: {
            auth: {
              experimentalDynamicClientRegistration: {
                allowedRedirectUriPatterns: ['cursor:*'],
              },
            },
          },
        });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['cursor://callback/asd?asd=asd'],
        });

        expect(client).toEqual(
          expect.objectContaining({
            redirectUris: ['cursor://callback/asd?asd=asd'],
          }),
        );
      });

      it('should create a client with default values', async () => {
        const { service } = await createOidcService({ databaseId });

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

    describe('createAuthorizationSession', () => {
      it('should create a authorization session for valid client', async () => {
        const { service } = await createOidcService({ databaseId });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          scope: 'openid',
          state: 'test-state',
        });

        expect(authSession).toEqual({
          id: expect.any(String),
          clientName: 'Test Client',
          scope: 'openid',
          redirectUri: 'https://example.com/callback',
        });
      });

      it('should throw error for invalid client', async () => {
        const { service } = await createOidcService({ databaseId });

        await expect(
          service.createAuthorizationSession({
            clientId: 'invalid-client',
            redirectUri: 'https://example.com/callback',
            responseType: 'code',
          }),
        ).rejects.toThrow('Invalid client_id');
      });

      it('should throw error for invalid redirect URI', async () => {
        const { service } = await createOidcService({ databaseId });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        await expect(
          service.createAuthorizationSession({
            clientId: client.clientId,
            redirectUri: 'https://invalid.com/callback',
            responseType: 'code',
          }),
        ).rejects.toThrow('Invalid redirect_uri');
      });

      it('should throw error for unsupported response type', async () => {
        const { service } = await createOidcService({ databaseId });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        await expect(
          service.createAuthorizationSession({
            clientId: client.clientId,
            redirectUri: 'https://example.com/callback',
            responseType: 'token',
          }),
        ).rejects.toThrow('Only authorization code flow is supported');
      });

      it('should handle PKCE parameters', async () => {
        const { service } = await createOidcService({ databaseId });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          codeChallenge: 'test-challenge',
          codeChallengeMethod: 'S256',
        });

        expect(authSession.id).toBeDefined();
      });

      it('should throw error for invalid PKCE method', async () => {
        const { service } = await createOidcService({ databaseId });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        await expect(
          service.createAuthorizationSession({
            clientId: client.clientId,
            redirectUri: 'https://example.com/callback',
            responseType: 'code',
            codeChallenge: 'test-challenge',
            codeChallengeMethod: 'invalid',
          }),
        ).rejects.toThrow('Invalid code_challenge_method');
      });
    });

    describe('approveAuthorizationSession', () => {
      it('should approve a valid authorization session', async () => {
        const { service } = await createOidcService({ databaseId });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          state: 'test-state',
        });

        const result = await service.approveAuthorizationSession({
          sessionId: authSession.id,
          userEntityRef: 'user:default/test',
        });

        expect(result.redirectUrl).toMatch(
          /^https:\/\/example\.com\/callback\?code=.+&state=test-state$/,
        );
      });

      it('should throw error for invalid authorization session', async () => {
        const { service } = await createOidcService({ databaseId });

        await expect(
          service.approveAuthorizationSession({
            sessionId: 'invalid-session',
            userEntityRef: 'user:default/test',
          }),
        ).rejects.toThrow('Invalid authorization session');
      });

      it('should throw error when trying to approve an already approved session', async () => {
        const { service } = await createOidcService({ databaseId });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
        });

        await service.approveAuthorizationSession({
          sessionId: authSession.id,
          userEntityRef: 'user:default/test',
        });

        await expect(
          service.approveAuthorizationSession({
            sessionId: authSession.id,
            userEntityRef: 'user:default/test',
          }),
        ).rejects.toThrow('Authorization session not found or expired');
      });

      it('should throw error when trying to approve an already rejected session', async () => {
        const { service } = await createOidcService({ databaseId });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
        });

        await service.rejectAuthorizationSession({
          sessionId: authSession.id,
          userEntityRef: 'user:default/test',
        });

        await expect(
          service.approveAuthorizationSession({
            sessionId: authSession.id,
            userEntityRef: 'user:default/test',
          }),
        ).rejects.toThrow('Authorization session not found or expired');
      });
    });

    describe('getAuthorizationSession', () => {
      it('should return authorization session details', async () => {
        const { service } = await createOidcService({ databaseId });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          scope: 'openid',
          state: 'test-state',
        });

        const details = await service.getAuthorizationSession({
          sessionId: authSession.id,
        });

        expect(details).toEqual(
          expect.objectContaining({
            id: authSession.id,
            clientId: client.clientId,
            clientName: 'Test Client',
            redirectUri: 'https://example.com/callback',
            scope: 'openid',
            state: 'test-state',
            responseType: 'code',
          }),
        );
      });

      it('should throw error when trying to get an already approved session', async () => {
        const { service } = await createOidcService({ databaseId });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
        });

        await service.approveAuthorizationSession({
          sessionId: authSession.id,
          userEntityRef: 'user:default/test',
        });

        await expect(
          service.getAuthorizationSession({
            sessionId: authSession.id,
          }),
        ).rejects.toThrow('Authorization session not found or expired');
      });

      it('should throw error when trying to get an already rejected session', async () => {
        const { service } = await createOidcService({ databaseId });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
        });

        await service.rejectAuthorizationSession({
          sessionId: authSession.id,
          userEntityRef: 'user:default/test',
        });

        await expect(
          service.getAuthorizationSession({
            sessionId: authSession.id,
          }),
        ).rejects.toThrow('Authorization session not found or expired');
      });
    });

    describe('rejectAuthorizationSession', () => {
      it('should reject a authorization session', async () => {
        const { service } = await createOidcService({ databaseId });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
        });

        await service.rejectAuthorizationSession({
          sessionId: authSession.id,
          userEntityRef: 'user:default/test',
        });

        await expect(
          service.getAuthorizationSession({
            sessionId: authSession.id,
          }),
        ).rejects.toThrow('Authorization session not found or expired');
      });

      it('should throw error for invalid authorization session', async () => {
        const { service } = await createOidcService({ databaseId });

        await expect(
          service.rejectAuthorizationSession({
            sessionId: 'invalid-session',
            userEntityRef: 'user:default/test',
          }),
        ).rejects.toThrow('Invalid authorization session');
      });

      it('should throw error when trying to reject an already approved session', async () => {
        const { service } = await createOidcService({ databaseId });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
        });

        await service.approveAuthorizationSession({
          sessionId: authSession.id,
          userEntityRef: 'user:default/test',
        });

        await expect(
          service.rejectAuthorizationSession({
            sessionId: authSession.id,
            userEntityRef: 'user:default/test',
          }),
        ).rejects.toThrow('Authorization session not found or expired');
      });

      it('should throw error when trying to reject an already rejected session', async () => {
        const { service } = await createOidcService({ databaseId });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
        });

        await service.rejectAuthorizationSession({
          sessionId: authSession.id,
          userEntityRef: 'user:default/test',
        });

        await expect(
          service.rejectAuthorizationSession({
            sessionId: authSession.id,
            userEntityRef: 'user:default/test',
          }),
        ).rejects.toThrow('Authorization session not found or expired');
      });
    });

    describe('exchangeCodeForToken', () => {
      it('should exchange valid code for tokens', async () => {
        const { service, mocks } = await createOidcService({ databaseId });
        const mockToken = 'mock-jwt-token';
        mocks.tokenIssuer.issueToken.mockResolvedValue({ token: mockToken });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          scope: 'openid',
        });

        const authResult = await service.approveAuthorizationSession({
          sessionId: authSession.id,
          userEntityRef: 'user:default/test',
        });

        const code = new URL(authResult.redirectUrl).searchParams.get('code')!;

        const tokenResult = await service.exchangeCodeForToken({
          code,
          redirectUri: 'https://example.com/callback',
          grantType: 'authorization_code',
          expiresIn: 3600,
        });

        expect(tokenResult).toEqual({
          accessToken: mockToken,
          tokenType: 'Bearer',
          expiresIn: 3600,
          idToken: mockToken,
          scope: 'openid',
        });
      });

      it('should exchange valid code for tokens with custom expiration', async () => {
        const { service, mocks } = await createOidcService({ databaseId });
        const mockToken = 'mock-jwt-token';
        mocks.tokenIssuer.issueToken.mockResolvedValue({ token: mockToken });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          scope: 'openid',
        });

        const authResult = await service.approveAuthorizationSession({
          sessionId: authSession.id,
          userEntityRef: 'user:default/test',
        });

        const code = new URL(authResult.redirectUrl).searchParams.get('code')!;

        const tokenResult = await service.exchangeCodeForToken({
          code,
          redirectUri: 'https://example.com/callback',
          grantType: 'authorization_code',
          expiresIn: 6000,
        });

        expect(tokenResult).toEqual({
          accessToken: mockToken,
          tokenType: 'Bearer',
          expiresIn: 6000,
          idToken: mockToken,
          scope: 'openid',
        });
      });

      it('should throw error for invalid grant type', async () => {
        const { service } = await createOidcService({ databaseId });

        await expect(
          service.exchangeCodeForToken({
            code: 'test-code',
            redirectUri: 'https://example.com/callback',
            grantType: 'client_credentials',
            expiresIn: 3600,
          }),
        ).rejects.toThrow('Unsupported grant type');
      });

      it('should handle PKCE verification', async () => {
        const { service, mocks } = await createOidcService({ databaseId });
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

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          codeChallenge,
          codeChallengeMethod: 'S256',
        });

        const authResult = await service.approveAuthorizationSession({
          sessionId: authSession.id,
          userEntityRef: 'user:default/test',
        });

        const code = new URL(authResult.redirectUrl).searchParams.get('code')!;

        const tokenResult = await service.exchangeCodeForToken({
          code,
          redirectUri: 'https://example.com/callback',
          grantType: 'authorization_code',
          codeVerifier,
          expiresIn: 3600,
        });

        expect(tokenResult.accessToken).toBe(mockToken);
      });

      it('should throw error for invalid PKCE verifier', async () => {
        const { service } = await createOidcService({ databaseId });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
        });

        const codeChallenge = 'test-challenge';
        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          codeChallenge,
          codeChallengeMethod: 'S256',
        });

        const authResult = await service.approveAuthorizationSession({
          sessionId: authSession.id,
          userEntityRef: 'user:default/test',
        });

        const code = new URL(authResult.redirectUrl).searchParams.get('code')!;

        await expect(
          service.exchangeCodeForToken({
            code,
            redirectUri: 'https://example.com/callback',
            grantType: 'authorization_code',
            codeVerifier: 'invalid-verifier',
            expiresIn: 3600,
          }),
        ).rejects.toThrow('Invalid code verifier');
      });
    });

    describe('CIMD (Client ID Metadata Document) support', () => {
      const cimdClientId = 'https://example.com/oauth-metadata.json';
      const cimdMetadata: CimdClientInfo = {
        clientId: cimdClientId,
        clientName: 'CIMD Test Client',
        redirectUris: ['http://localhost:8080/callback'],
        responseTypes: ['code'],
        grantTypes: ['authorization_code'],
        scope: 'openid',
      };

      beforeEach(() => {
        mockFetchCimdMetadata.mockResolvedValue(cimdMetadata);
      });

      afterEach(() => {
        mockFetchCimdMetadata.mockReset();
      });

      describe('getConfiguration', () => {
        it('should include client_id_metadata_document_supported when CIMD is enabled', async () => {
          const { service } = await createOidcService({
            databaseId,
            config: {
              auth: {
                experimentalClientIdMetadataDocuments: { enabled: true },
              },
            },
          });

          const config = service.getConfiguration();

          expect(config.client_id_metadata_document_supported).toBe(true);
        });

        it('should not include client_id_metadata_document_supported when CIMD is disabled', async () => {
          const { service } = await createOidcService({
            databaseId,
            config: {
              auth: {
                experimentalClientIdMetadataDocuments: { enabled: false },
              },
            },
          });

          const config = service.getConfiguration();

          expect(config).not.toHaveProperty(
            'client_id_metadata_document_supported',
          );
        });
      });

      describe('createAuthorizationSession with CIMD', () => {
        it('should create authorization session for CIMD client', async () => {
          const { service } = await createOidcService({
            databaseId,
            config: {
              auth: {
                experimentalClientIdMetadataDocuments: { enabled: true },
              },
            },
          });

          const authSession = await service.createAuthorizationSession({
            clientId: cimdClientId,
            redirectUri: 'http://localhost:8080/callback',
            responseType: 'code',
            scope: 'openid',
          });

          expect(authSession).toEqual({
            id: expect.any(String),
            clientName: 'CIMD Test Client',
            scope: 'openid',
            redirectUri: 'http://localhost:8080/callback',
          });
          expect(mockFetchCimdMetadata).toHaveBeenCalledWith(cimdClientId);
        });

        it('should throw error when CIMD is disabled but URL client_id is provided', async () => {
          const { service } = await createOidcService({
            databaseId,
            config: {
              auth: {
                experimentalClientIdMetadataDocuments: { enabled: false },
              },
            },
          });

          await expect(
            service.createAuthorizationSession({
              clientId: cimdClientId,
              redirectUri: 'http://localhost:8080/callback',
              responseType: 'code',
            }),
          ).rejects.toThrow('Client ID metadata documents not enabled');
        });

        it('should throw error for redirect_uri not in CIMD metadata', async () => {
          const { service } = await createOidcService({
            databaseId,
            config: {
              auth: {
                experimentalClientIdMetadataDocuments: { enabled: true },
              },
            },
          });

          await expect(
            service.createAuthorizationSession({
              clientId: cimdClientId,
              redirectUri: 'http://unauthorized.com/callback',
              responseType: 'code',
            }),
          ).rejects.toThrow('Redirect URI not registered');
        });

        it('should throw error when redirect_uri does not match allowedRedirectUriPatterns', async () => {
          const { service } = await createOidcService({
            databaseId,
            config: {
              auth: {
                experimentalClientIdMetadataDocuments: {
                  enabled: true,
                  allowedRedirectUriPatterns: ['https://*.example.com/*'],
                },
              },
            },
          });

          await expect(
            service.createAuthorizationSession({
              clientId: cimdClientId,
              redirectUri: 'http://localhost:8080/callback',
              responseType: 'code',
            }),
          ).rejects.toThrow('Invalid redirect_uri');
        });
      });

      describe('getAuthorizationSession with CIMD', () => {
        it('should return session details for CIMD client', async () => {
          const { service } = await createOidcService({
            databaseId,
            config: {
              auth: {
                experimentalClientIdMetadataDocuments: { enabled: true },
              },
            },
          });

          const authSession = await service.createAuthorizationSession({
            clientId: cimdClientId,
            redirectUri: 'http://localhost:8080/callback',
            responseType: 'code',
            scope: 'openid',
            state: 'test-state',
          });

          const details = await service.getAuthorizationSession({
            sessionId: authSession.id,
          });

          expect(details).toEqual(
            expect.objectContaining({
              id: authSession.id,
              clientId: cimdClientId,
              clientName: 'CIMD Test Client',
              redirectUri: 'http://localhost:8080/callback',
              scope: 'openid',
              state: 'test-state',
            }),
          );
        });
      });

      describe('full CIMD authorization flow', () => {
        it('should complete full authorization flow for CIMD client', async () => {
          const { service, mocks } = await createOidcService({
            databaseId,
            config: {
              auth: {
                experimentalClientIdMetadataDocuments: { enabled: true },
              },
            },
          });
          const mockToken = 'mock-jwt-token';
          mocks.tokenIssuer.issueToken.mockResolvedValue({ token: mockToken });

          // Create authorization session
          const authSession = await service.createAuthorizationSession({
            clientId: cimdClientId,
            redirectUri: 'http://localhost:8080/callback',
            responseType: 'code',
            scope: 'openid',
          });

          // Approve the session
          const approveResult = await service.approveAuthorizationSession({
            sessionId: authSession.id,
            userEntityRef: 'user:default/test',
          });

          expect(approveResult.redirectUrl).toMatch(
            /^http:\/\/localhost:8080\/callback\?code=.+$/,
          );

          // Exchange code for token
          const code = new URL(approveResult.redirectUrl).searchParams.get(
            'code',
          )!;
          const tokenResult = await service.exchangeCodeForToken({
            code,
            redirectUri: 'http://localhost:8080/callback',
            grantType: 'authorization_code',
            expiresIn: 3600,
          });

          expect(tokenResult).toEqual({
            accessToken: mockToken,
            tokenType: 'Bearer',
            expiresIn: 3600,
            idToken: mockToken,
            scope: 'openid',
          });
        });

        it('should complete CIMD flow with PKCE', async () => {
          const { service, mocks } = await createOidcService({
            databaseId,
            config: {
              auth: {
                experimentalClientIdMetadataDocuments: { enabled: true },
              },
            },
          });
          const mockToken = 'mock-jwt-token';
          mocks.tokenIssuer.issueToken.mockResolvedValue({ token: mockToken });

          const codeVerifier = 'test-code-verifier-for-pkce';
          const codeChallenge = crypto
            .createHash('sha256')
            .update(codeVerifier)
            .digest('base64url');

          // Create authorization session with PKCE
          const authSession = await service.createAuthorizationSession({
            clientId: cimdClientId,
            redirectUri: 'http://localhost:8080/callback',
            responseType: 'code',
            codeChallenge,
            codeChallengeMethod: 'S256',
          });

          // Approve the session
          const approveResult = await service.approveAuthorizationSession({
            sessionId: authSession.id,
            userEntityRef: 'user:default/test',
          });

          // Exchange code for token with verifier
          const code = new URL(approveResult.redirectUrl).searchParams.get(
            'code',
          )!;
          const tokenResult = await service.exchangeCodeForToken({
            code,
            redirectUri: 'http://localhost:8080/callback',
            grantType: 'authorization_code',
            codeVerifier,
            expiresIn: 3600,
          });

          expect(tokenResult.accessToken).toBe(mockToken);
        });
      });

      describe('coexistence of CIMD and DCR', () => {
        it('should use DCR for non-URL client_id when both are enabled', async () => {
          const { service } = await createOidcService({
            databaseId,
            config: {
              auth: {
                experimentalClientIdMetadataDocuments: { enabled: true },
                experimentalDynamicClientRegistration: { enabled: true },
              },
            },
          });

          // Register a DCR client
          const dcrClient = await service.registerClient({
            clientName: 'DCR Client',
            redirectUris: ['https://example.com/callback'],
          });

          // Create session with DCR client
          const authSession = await service.createAuthorizationSession({
            clientId: dcrClient.clientId,
            redirectUri: 'https://example.com/callback',
            responseType: 'code',
          });

          expect(authSession.clientName).toBe('DCR Client');
          expect(mockFetchCimdMetadata).not.toHaveBeenCalled();
        });

        it('should use CIMD for URL client_id when both are enabled', async () => {
          const { service } = await createOidcService({
            databaseId,
            config: {
              auth: {
                experimentalClientIdMetadataDocuments: { enabled: true },
                experimentalDynamicClientRegistration: { enabled: true },
              },
            },
          });

          const authSession = await service.createAuthorizationSession({
            clientId: cimdClientId,
            redirectUri: 'http://localhost:8080/callback',
            responseType: 'code',
          });

          expect(authSession.clientName).toBe('CIMD Test Client');
          expect(mockFetchCimdMetadata).toHaveBeenCalledWith(cimdClientId);
        });
      });
    });
  });
});

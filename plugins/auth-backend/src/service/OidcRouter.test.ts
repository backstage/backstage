/*
 * Copyright 2020 The Backstage Authors
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
  coreServices,
  createBackendPlugin,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import {
  mockServices,
  startTestBackend,
  TestDatabases,
  TestDatabaseId,
  mockCredentials,
} from '@backstage/backend-test-utils';
import request from 'supertest';
import crypto from 'crypto';
import { OidcRouter } from './OidcRouter';
import { UserInfoDatabase } from '../database/UserInfoDatabase';
import { OidcDatabase } from '../database/OidcDatabase';
import { AuthDatabase } from '../database/AuthDatabase';
import { OidcService } from '../service/OidcService';
import { TokenIssuer } from '../identity/types';

jest.setTimeout(60_000);

describe('OidcRouter', () => {
  const MOCK_USER_TOKEN = 'mock-user-token';
  const MOCK_USER_ENTITY_REF = 'user:default/test-user';
  const databases = TestDatabases.create();

  async function createRouter(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);

    await knex.migrate.latest({
      directory: resolvePackagePath(
        '@backstage/plugin-auth-backend',
        'migrations',
      ),
    });

    const authDatabase = AuthDatabase.create({
      getClient: async () => knex,
    });

    const oidcDatabase = await OidcDatabase.create({
      database: authDatabase,
    });

    const userInfoDatabase = await UserInfoDatabase.create({
      database: authDatabase,
    });

    const mockTokenIssuer = {
      issueToken: jest.fn(),
      listPublicKeys: jest.fn(),
    } as unknown as jest.Mocked<TokenIssuer>;

    const mockAuth = mockServices.auth.mock();
    const mockHttpAuth = mockServices.httpAuth.mock();
    const mockConfig = mockServices.rootConfig({
      data: {
        auth: {
          experimentalDynamicClientRegistration: {
            enabled: true,
          },
        },
      },
    });

    const oidcService = OidcService.create({
      auth: mockAuth,
      tokenIssuer: mockTokenIssuer,
      baseUrl: 'http://localhost:7000',
      userInfo: userInfoDatabase,
      oidc: oidcDatabase,
      config: mockConfig,
    });

    const oidcRouter = OidcRouter.create({
      auth: mockAuth,
      tokenIssuer: mockTokenIssuer,
      baseUrl: 'http://localhost:7000',
      appUrl: 'http://localhost:3000',
      logger: mockServices.logger.mock(),
      userInfo: userInfoDatabase,
      oidc: oidcDatabase,
      httpAuth: mockHttpAuth,
      config: mockConfig,
    });

    return {
      router: oidcRouter,
      mocks: {
        httpAuth: mockHttpAuth,
        auth: mockAuth,
        oidc: oidcDatabase,
        userInfo: userInfoDatabase,
        service: oidcService,
        tokenIssuer: mockTokenIssuer,
      },
    };
  }

  describe.each(databases.eachSupportedId())('%p', databaseId => {
    describe('/v1/userinfo', () => {
      it('should return user info for full tokens', async () => {
        const {
          mocks: { auth, userInfo },
          router,
        } = await createRouter(databaseId);

        await userInfo.addUserInfo({
          claims: {
            sub: 'k/ns:n',
            ent: ['k/ns:a', 'k/ns:b'],
            exp: Math.floor(Date.now() / 1000) + 3600,
          },
        });

        const { server } = await startTestBackend({
          features: [
            createBackendPlugin({
              pluginId: 'auth',
              register(reg) {
                reg.registerInit({
                  deps: { httpRouter: coreServices.httpRouter },
                  async init({ httpRouter }) {
                    httpRouter.use(router.getRouter());
                    httpRouter.addAuthPolicy({
                      path: '/',
                      allow: 'unauthenticated',
                    });
                  },
                });
              },
            }),
          ],
        });

        auth.isPrincipal.mockReturnValueOnce(true);

        const response = await request(server)
          .get('/api/auth/v1/userinfo')
          .set(
            'Authorization',
            `Bearer h.${btoa(
              JSON.stringify({ sub: 'k/ns:n', ent: ['k/ns:a', 'k/ns:b'] }),
            )}.s`,
          )
          .expect(200);

        expect(response.body).toEqual({
          claims: {
            sub: 'k/ns:n',
            ent: ['k/ns:a', 'k/ns:b'],
            exp: expect.any(Number),
          },
        });
      });

      it('should return user info for limited tokens', async () => {
        const {
          mocks: { auth, userInfo },
          router,
        } = await createRouter(databaseId);

        await userInfo.addUserInfo({
          claims: {
            sub: 'k/ns:n',
            ent: ['k/ns:a', 'k/ns:b'],
            exp: Math.floor(Date.now() / 1000) + 3600,
          },
        });

        const { server } = await startTestBackend({
          features: [
            createBackendPlugin({
              pluginId: 'auth',
              register(reg) {
                reg.registerInit({
                  deps: { httpRouter: coreServices.httpRouter },
                  async init({ httpRouter }) {
                    httpRouter.use(router.getRouter());
                    httpRouter.addAuthPolicy({
                      path: '/',
                      allow: 'unauthenticated',
                    });
                  },
                });
              },
            }),
          ],
        });

        auth.isPrincipal.mockReturnValueOnce(true);

        const response = await request(server)
          .get('/api/auth/v1/userinfo')
          .set(
            'Authorization',
            `Bearer h.${btoa(JSON.stringify({ sub: 'k/ns:n' }))}.s`,
          )
          .expect(200);

        expect(response.body).toEqual({
          claims: {
            sub: 'k/ns:n',
            ent: ['k/ns:a', 'k/ns:b'],
            exp: expect.any(Number),
          },
        });
      });
    });

    describe('auth flow', () => {
      it('should register a client', async () => {
        const { router } = await createRouter(databaseId);

        const { server } = await startTestBackend({
          features: [
            createBackendPlugin({
              pluginId: 'auth',
              register(reg) {
                reg.registerInit({
                  deps: { httpRouter: coreServices.httpRouter },
                  async init({ httpRouter }) {
                    httpRouter.use(router.getRouter());
                    httpRouter.addAuthPolicy({
                      path: '/',
                      allow: 'unauthenticated',
                    });
                  },
                });
              },
            }),
          ],
        });

        const response = await request(server)
          .post('/api/auth/v1/register')
          .send({
            client_name: 'Test Client',
            redirect_uris: ['https://example.com/callback'],
            response_types: ['code'],
            grant_types: ['authorization_code'],
            scope: 'openid',
          })
          .expect(201);

        expect(response.body).toEqual({
          client_id: expect.any(String),
          client_secret: expect.any(String),
          redirect_uris: ['https://example.com/callback'],
        });
      });

      it('should create an authorization session via authorization endpoint', async () => {
        const {
          mocks: { service },
          router,
        } = await createRouter(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
          scope: 'openid',
        });

        const { server } = await startTestBackend({
          features: [
            createBackendPlugin({
              pluginId: 'auth',
              register(reg) {
                reg.registerInit({
                  deps: { httpRouter: coreServices.httpRouter },
                  async init({ httpRouter }) {
                    httpRouter.use(router.getRouter());
                    httpRouter.addAuthPolicy({
                      path: '/',
                      allow: 'unauthenticated',
                    });
                  },
                });
              },
            }),
          ],
        });

        const response = await request(server)
          .get('/api/auth/v1/authorize')
          .query({
            client_id: client.clientId,
            redirect_uri: 'https://example.com/callback',
            response_type: 'code',
            scope: 'openid',
            state: 'test-state',
          })
          .expect(302);

        expect(response.header.location).toMatch(
          /^http:\/\/localhost:3000\/oauth2\/authorize\/[a-f0-9-]+$/,
        );
      });

      it('should get auth session details', async () => {
        const {
          mocks: { service },
          router,
        } = await createRouter(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
          scope: 'openid',
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          scope: 'openid',
          state: 'test-state',
        });

        const { server } = await startTestBackend({
          features: [
            createBackendPlugin({
              pluginId: 'auth',
              register(reg) {
                reg.registerInit({
                  deps: { httpRouter: coreServices.httpRouter },
                  async init({ httpRouter }) {
                    httpRouter.use(router.getRouter());
                    httpRouter.addAuthPolicy({
                      path: '/',
                      allow: 'unauthenticated',
                    });
                  },
                });
              },
            }),
          ],
        });

        const response = await request(server)
          .get(`/api/auth/v1/sessions/${authSession.id}`)
          .expect(200);

        expect(response.body).toEqual({
          id: authSession.id,
          clientName: 'Test Client',
          scope: 'openid',
          redirectUri: 'https://example.com/callback',
        });
      });

      it('should approve authorization session', async () => {
        const {
          mocks: { auth, service, httpAuth },
          router,
        } = await createRouter(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
          scope: 'openid',
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          scope: 'openid',
          state: 'test-state',
        });

        const { server } = await startTestBackend({
          features: [
            createBackendPlugin({
              pluginId: 'auth',
              register(reg) {
                reg.registerInit({
                  deps: { httpRouter: coreServices.httpRouter },
                  async init({ httpRouter }) {
                    httpRouter.use(router.getRouter());
                    httpRouter.addAuthPolicy({
                      path: '/',
                      allow: 'unauthenticated',
                    });
                  },
                });
              },
            }),
          ],
        });

        httpAuth.credentials.mockResolvedValueOnce(
          mockCredentials.user('user:default/test-user'),
        );

        auth.isPrincipal.mockReturnValueOnce(true);

        const response = await request(server)
          .post(`/api/auth/v1/sessions/${authSession.id}/approve`)
          .set('Authorization', `Bearer ${MOCK_USER_TOKEN}`)
          .expect(200);

        expect(response.body).toEqual({
          redirectUrl: expect.stringMatching(
            /^https:\/\/example\.com\/callback\?code=[\w-]+&state=test-state$/,
          ),
        });
      });

      it('should reject auth session', async () => {
        const {
          mocks: { service, httpAuth, auth },
          router,
        } = await createRouter(databaseId);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
          scope: 'openid',
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          scope: 'openid',
          state: 'test-state',
        });

        httpAuth.credentials.mockResolvedValueOnce(
          mockCredentials.user('user:default/test-user'),
        );

        auth.isPrincipal.mockReturnValueOnce(true);

        const { server } = await startTestBackend({
          features: [
            createBackendPlugin({
              pluginId: 'auth',
              register(reg) {
                reg.registerInit({
                  deps: { httpRouter: coreServices.httpRouter },
                  async init({ httpRouter }) {
                    httpRouter.use(router.getRouter());
                    httpRouter.addAuthPolicy({
                      path: '/',
                      allow: 'unauthenticated',
                    });
                  },
                });
              },
            }),
          ],
        });

        const response = await request(server)
          .post(`/api/auth/v1/sessions/${authSession.id}/reject`)
          .expect(200);

        expect(response.body).toEqual({
          redirectUrl: expect.stringMatching(
            /^https:\/\/example\.com\/callback\?error=access_denied&error_description=User\+denied\+the\+request&state=test-state$/,
          ),
        });
      });
    });

    describe('token exchange', () => {
      it('should exchange authorization code for tokens', async () => {
        const {
          mocks: { auth, service, tokenIssuer, httpAuth },
          router,
        } = await createRouter(databaseId);

        httpAuth.credentials.mockResolvedValueOnce(
          mockCredentials.user('user:default/test-user'),
        );

        auth.isPrincipal.mockReturnValueOnce(true);

        tokenIssuer.issueToken.mockResolvedValue({
          token: 'mock-access-token',
        });

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
          scope: 'openid',
        });

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          scope: 'openid',
          state: 'test-state',
        });

        const { server } = await startTestBackend({
          features: [
            createBackendPlugin({
              pluginId: 'auth',
              register(reg) {
                reg.registerInit({
                  deps: { httpRouter: coreServices.httpRouter },
                  async init({ httpRouter }) {
                    httpRouter.use(router.getRouter());
                    httpRouter.addAuthPolicy({
                      path: '/',
                      allow: 'unauthenticated',
                    });
                  },
                });
              },
            }),
          ],
        });

        const approvalResponse = await request(server)
          .post(`/api/auth/v1/sessions/${authSession.id}/approve`)
          .set('Authorization', `Bearer ${MOCK_USER_TOKEN}`)
          .expect(200);

        const redirectUrl = new URL(approvalResponse.body.redirectUrl);
        const authorizationCode = redirectUrl.searchParams.get('code');

        expect(authorizationCode).toBeDefined();

        const tokenResponse = await request(server)
          .post('/api/auth/v1/token')
          .send({
            grant_type: 'authorization_code',
            code: authorizationCode,
            redirect_uri: 'https://example.com/callback',
          })
          .expect(200);

        expect(tokenResponse.body).toEqual({
          access_token: 'mock-access-token',
          token_type: 'Bearer',
          expires_in: 3600,
          id_token: 'mock-access-token',
          scope: 'openid',
        });

        expect(tokenIssuer.issueToken).toHaveBeenCalledWith({
          claims: {
            sub: MOCK_USER_ENTITY_REF,
          },
        });
      });

      it('should exchange authorization code for tokens with PKCE', async () => {
        const {
          mocks: { auth, service, tokenIssuer, httpAuth },
          router,
        } = await createRouter(databaseId);

        tokenIssuer.issueToken.mockResolvedValue({
          token: 'mock-access-token-pkce',
        });

        httpAuth.credentials.mockResolvedValueOnce(
          mockCredentials.user('user:default/test-user-pkce'),
        );

        auth.isPrincipal.mockReturnValueOnce(true);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
          scope: 'openid',
        });

        const codeVerifier =
          'test-code-verifier-123456789012345678901234567890123456789012345';
        const codeChallenge = codeVerifier;

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          scope: 'openid',
          state: 'test-state',
          codeChallenge,
          codeChallengeMethod: 'plain',
        });

        const { server } = await startTestBackend({
          features: [
            createBackendPlugin({
              pluginId: 'auth',
              register(reg) {
                reg.registerInit({
                  deps: { httpRouter: coreServices.httpRouter },
                  async init({ httpRouter }) {
                    httpRouter.use(router.getRouter());
                    httpRouter.addAuthPolicy({
                      path: '/',
                      allow: 'unauthenticated',
                    });
                  },
                });
              },
            }),
          ],
        });

        const approvalResponse = await request(server)
          .post(`/api/auth/v1/sessions/${authSession.id}/approve`)
          .set('Authorization', `Bearer ${MOCK_USER_TOKEN}`)
          .expect(200);

        const redirectUrl = new URL(approvalResponse.body.redirectUrl);
        const authorizationCode = redirectUrl.searchParams.get('code');

        expect(authorizationCode).toBeDefined();

        const tokenResponse = await request(server)
          .post('/api/auth/v1/token')
          .send({
            grant_type: 'authorization_code',
            code: authorizationCode,
            redirect_uri: 'https://example.com/callback',
            code_verifier: codeVerifier,
          })
          .expect(200);

        expect(tokenResponse.body).toEqual({
          access_token: 'mock-access-token-pkce',
          token_type: 'Bearer',
          expires_in: 3600,
          id_token: 'mock-access-token-pkce',
          scope: 'openid',
        });

        expect(tokenIssuer.issueToken).toHaveBeenCalledWith({
          claims: {
            sub: 'user:default/test-user-pkce',
          },
        });
      });

      it('should reject token exchange with invalid authorization code', async () => {
        const { router } = await createRouter(databaseId);

        const { server } = await startTestBackend({
          features: [
            createBackendPlugin({
              pluginId: 'auth',
              register(reg) {
                reg.registerInit({
                  deps: { httpRouter: coreServices.httpRouter },
                  async init({ httpRouter }) {
                    httpRouter.use(router.getRouter());
                    httpRouter.addAuthPolicy({
                      path: '/',
                      allow: 'unauthenticated',
                    });
                  },
                });
              },
            }),
          ],
        });

        const tokenResponse = await request(server)
          .post('/api/auth/v1/token')
          .send({
            grant_type: 'authorization_code',
            code: 'invalid-code',
            redirect_uri: 'https://example.com/callback',
          })
          .expect(401);

        expect(tokenResponse.body).toEqual({
          error: 'invalid_client',
          error_description: 'Invalid authorization code',
        });
      });

      it('should exchange authorization code for tokens with PKCE S256', async () => {
        const {
          mocks: { auth, service, tokenIssuer, httpAuth },
          router,
        } = await createRouter(databaseId);

        tokenIssuer.issueToken.mockResolvedValue({
          token: 'mock-access-token-s256',
        });

        httpAuth.credentials.mockResolvedValueOnce(
          mockCredentials.user('user:default/test-user-s256'),
        );

        auth.isPrincipal.mockReturnValueOnce(true);

        const client = await service.registerClient({
          clientName: 'Test Client',
          redirectUris: ['https://example.com/callback'],
          responseTypes: ['code'],
          grantTypes: ['authorization_code'],
          scope: 'openid',
        });

        const codeVerifier =
          'test-code-verifier-s256-123456789012345678901234567890123456789';
        const codeChallenge = crypto
          .createHash('sha256')
          .update(codeVerifier)
          .digest('base64url');

        const authSession = await service.createAuthorizationSession({
          clientId: client.clientId,
          redirectUri: 'https://example.com/callback',
          responseType: 'code',
          scope: 'openid',
          state: 'test-state',
          codeChallenge,
          codeChallengeMethod: 'S256',
        });

        const { server } = await startTestBackend({
          features: [
            createBackendPlugin({
              pluginId: 'auth',
              register(reg) {
                reg.registerInit({
                  deps: { httpRouter: coreServices.httpRouter },
                  async init({ httpRouter }) {
                    httpRouter.use(router.getRouter());
                    httpRouter.addAuthPolicy({
                      path: '/',
                      allow: 'unauthenticated',
                    });
                  },
                });
              },
            }),
          ],
        });

        const approvalResponse = await request(server)
          .post(`/api/auth/v1/sessions/${authSession.id}/approve`)
          .set('Authorization', `Bearer ${MOCK_USER_TOKEN}`)
          .expect(200);

        const redirectUrl = new URL(approvalResponse.body.redirectUrl);
        const authorizationCode = redirectUrl.searchParams.get('code');

        expect(authorizationCode).toBeDefined();

        const tokenResponse = await request(server)
          .post('/api/auth/v1/token')
          .send({
            grant_type: 'authorization_code',
            code: authorizationCode,
            redirect_uri: 'https://example.com/callback',
            code_verifier: codeVerifier,
          })
          .expect(200);

        expect(tokenResponse.body).toEqual({
          access_token: 'mock-access-token-s256',
          token_type: 'Bearer',
          expires_in: 3600,
          id_token: 'mock-access-token-s256',
          scope: 'openid',
        });

        expect(tokenIssuer.issueToken).toHaveBeenCalledWith({
          claims: {
            sub: 'user:default/test-user-s256',
          },
        });
      });
    });
  });
});

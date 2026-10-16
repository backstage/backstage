/*
 * Copyright 2023 The Backstage Authors
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

import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  mockCredentials,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { RELATION_MEMBER_OF } from '@backstage/catalog-model';
import { authOwnershipResolutionExtensionPoint } from '@backstage/plugin-auth-node';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import request from 'supertest';
import { authPlugin } from './authPlugin';
import { AuthDatabase } from './database/AuthDatabase';
import authModuleGuestProvider from '@backstage/plugin-auth-backend-module-guest-provider';
import { authServiceFactory } from '@backstage/backend-defaults/auth';

describe('authPlugin', () => {
  it('should provide an OpenID configuration', async () => {
    const { server } = await startTestBackend({
      features: [
        authPlugin,
        mockServices.rootConfig.factory({
          data: {
            app: {
              baseUrl: 'http://localhost:3000',
            },
          },
        }),
      ],
    });

    const res = await request(server).get(
      '/api/auth/.well-known/openid-configuration',
    );
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      claims_supported: ['sub', 'ent'],
      issuer: `http://localhost:${server.port()}/api/auth`,
    });
  });

  describe('mock provider', () => {
    const mockProvidersConfig = {
      environment: 'test',
      providers: {
        guest: {
          dangerouslyAllowOutsideDevelopment: true,
          userEntityRef: 'user:default/tester',
          ownershipEntityRefs: [
            'group:default/testers',
            'group:default/testers2',
          ],
        },
      },
    };

    const expectedIdentity = {
      type: 'user',
      userEntityRef: 'user:default/tester',
      ownershipEntityRefs: ['group:default/testers', 'group:default/testers2'],
    };

    it('should return tokens with all identity claims by default', async () => {
      const { server } = await startTestBackend({
        features: [
          authPlugin,
          authModuleGuestProvider,
          authServiceFactory,
          mockServices.rootConfig.factory({
            data: {
              app: {
                baseUrl: 'http://localhost',
              },
              auth: {
                ...mockProvidersConfig,
              },
            },
          }),
        ],
      });

      const refreshRes = await request(server).post('/api/auth/guest/refresh');

      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body).toMatchObject({
        backstageIdentity: {
          expiresInSeconds: expect.any(Number),
          identity: expectedIdentity,
          token: expect.any(String),
        },
        profile: {},
      });

      const token = refreshRes.body.backstageIdentity.token;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      expect(decoded.sub).toEqual(expectedIdentity.userEntityRef);
      expect('ent' in decoded).toBeFalsy();

      const userInfoRes = await request(server)
        .get('/api/auth/v1/userinfo')
        .set('Authorization', `Bearer ${token}`);

      expect(userInfoRes.status).toBe(200);
      expect(userInfoRes.body).toMatchObject({
        claims: {
          sub: expectedIdentity.userEntityRef,
          ent: expectedIdentity.ownershipEntityRefs,
        },
      });
    });

    it('should include ownership claims in the token when the config is set to false', async () => {
      const { server } = await startTestBackend({
        features: [
          authPlugin,
          authModuleGuestProvider,
          authServiceFactory,
          mockServices.rootConfig.factory({
            data: {
              app: {
                baseUrl: 'http://localhost',
              },
              auth: {
                omitIdentityTokenOwnershipClaim: false,
                ...mockProvidersConfig,
              },
            },
          }),
        ],
      });

      const refreshRes = await request(server).post('/api/auth/guest/refresh');
      expect(refreshRes.status).toBe(200);
      expect(refreshRes.body).toMatchObject({
        backstageIdentity: {
          expiresInSeconds: expect.any(Number),
          identity: expectedIdentity,
          token: expect.any(String),
        },
        profile: {},
      });

      const token = refreshRes.body.backstageIdentity.token;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      expect(decoded.sub).toEqual(expectedIdentity.userEntityRef);
      expect(decoded.ent).toEqual(expectedIdentity.ownershipEntityRefs);

      const userInfoRes = await request(server)
        .get('/api/auth/v1/userinfo')
        .set('Authorization', `Bearer ${token}`);

      expect(userInfoRes.status).toBe(200);
      expect(userInfoRes.body).toMatchObject({
        claims: {
          sub: expectedIdentity.userEntityRef,
          ent: expectedIdentity.ownershipEntityRefs,
        },
      });
    });

    it('should re-resolve ownership claims and update userinfo when refreshing an OAuth token', async () => {
      const runMigrationsSpy = jest.spyOn(AuthDatabase, 'runMigrations');
      let currentGroups = ['group:default/initial-group'];
      const catalogMock = catalogServiceMock.mock({
        getEntityByRef: jest.fn().mockImplementation(async () => ({
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'User',
          metadata: { name: 'tester', namespace: 'default' },
          spec: {},
          relations: currentGroups.map(targetRef => ({
            type: RELATION_MEMBER_OF,
            targetRef,
          })),
        })),
      });

      const customOwnershipModule = createBackendModule({
        pluginId: 'auth',
        moduleId: 'custom-ownership',
        register(reg) {
          reg.registerInit({
            deps: { ownership: authOwnershipResolutionExtensionPoint },
            async init({ ownership }) {
              ownership.setAuthOwnershipResolver({
                async resolveOwnershipEntityRefs(entity) {
                  const groups =
                    entity.relations
                      ?.filter(r => r.type === RELATION_MEMBER_OF)
                      .map(r => r.targetRef) ?? [];
                  return {
                    ownershipEntityRefs: [
                      `user:default/${entity.metadata.name}`,
                      ...groups,
                    ],
                  };
                },
              });
            },
          });
        },
      });

      const { server } = await startTestBackend({
        features: [
          authPlugin,
          authModuleGuestProvider,
          customOwnershipModule,
          authServiceFactory,
          catalogMock.factory,
          mockServices.rootConfig.factory({
            data: {
              app: {
                baseUrl: 'http://localhost:3000',
              },
              auth: {
                ...mockProvidersConfig,
                experimentalDynamicClientRegistration: {
                  enabled: true,
                },
                experimentalRefreshToken: {
                  enabled: true,
                },
              },
            },
          }),
        ],
      });

      expect(runMigrationsSpy).toHaveBeenCalledTimes(1);
      runMigrationsSpy.mockRestore();

      // 1. Initial interactive login populates user_info with initial ownershipEntityRefs
      const signInRes = await request(server)
        .post('/api/auth/guest/refresh')
        .expect(200);
      const interactiveToken = signInRes.body.backstageIdentity.token;

      const initialUserInfoRes = await request(server)
        .get('/api/auth/v1/userinfo')
        .set('Authorization', `Bearer ${interactiveToken}`)
        .expect(200);
      expect(initialUserInfoRes.body).toMatchObject({
        claims: {
          sub: 'user:default/tester',
          ent: ['user:default/tester', 'group:default/initial-group'],
        },
      });

      // 2. Register OAuth client and complete authorization_code flow with offline_access
      const regRes = await request(server)
        .post('/api/auth/v1/register')
        .send({
          client_name: 'MCP Client',
          redirect_uris: ['http://localhost:8080/callback'],
        })
        .expect(201);

      const authRes = await request(server)
        .get('/api/auth/v1/authorize')
        .query({
          client_id: regRes.body.client_id,
          redirect_uri: 'http://localhost:8080/callback',
          response_type: 'code',
          scope: 'openid offline_access',
        })
        .expect(302);

      const sessionId = authRes.header.location.split('/').pop()!;
      const approveRes = await request(server)
        .post(`/api/auth/v1/sessions/${sessionId}/approve`)
        .set(
          'Authorization',
          mockCredentials.user.header('user:default/tester'),
        )
        .expect(200);

      const code = new URL(approveRes.body.redirectUrl).searchParams.get(
        'code',
      )!;
      const tokenRes = await request(server)
        .post('/api/auth/v1/token')
        .send({
          grant_type: 'authorization_code',
          code,
          redirect_uri: 'http://localhost:8080/callback',
        })
        .expect(200);

      // 3. Refresh the OAuth token after catalog group membership changed
      currentGroups = ['group:default/updated-group'];
      const refreshedTokenRes = await request(server)
        .post('/api/auth/v1/token')
        .send({
          grant_type: 'refresh_token',
          refresh_token: tokenRes.body.refresh_token,
        })
        .expect(200);

      // 4. Verify /v1/userinfo returns the newly resolved ownership claims
      const userInfoRes = await request(server)
        .get('/api/auth/v1/userinfo')
        .set('Authorization', `Bearer ${refreshedTokenRes.body.access_token}`)
        .expect(200);

      expect(userInfoRes.body).toMatchObject({
        claims: {
          sub: 'user:default/tester',
          ent: ['user:default/tester', 'group:default/updated-group'],
        },
      });
    });
  });
});

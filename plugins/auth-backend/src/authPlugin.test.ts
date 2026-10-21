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

import {
  mockCredentials,
  mockServices,
  startTestBackend,
  TestDatabases,
} from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import request from 'supertest';
import { authPlugin } from './authPlugin';
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
  });

  describe('offline session revocation', () => {
    jest.setTimeout(60_000);

    const databases = TestDatabases.create();

    it.each(databases.eachSupportedId())(
      'should revoke all offline sessions of a user, %p',
      async databaseId => {
        const knex = await databases.init(databaseId);
        const auditor = mockServices.auditor.mock();

        const { server } = await startTestBackend({
          features: [
            authPlugin,
            mockServices.database.factory({ knex }),
            auditor.factory,
            catalogServiceMock.factory(),
            mockServices.rootConfig.factory({
              data: {
                app: { baseUrl: 'http://localhost:3000' },
                auth: { experimentalRefreshToken: { enabled: true } },
              },
            }),
          ],
        });

        const sessions = ['a', 'b', 'c'].map((id, index) => ({
          id,
          user_entity_ref:
            index < 2 ? 'user:default/target' : 'user:default/other',
          oidc_client_id: null,
          token_hash: `hash-${id}`,
          created_at: knex.fn.now(),
          last_used_at: knex.fn.now(),
        }));
        await knex('offline_sessions').insert(sessions);

        // Only other backend services may call this endpoint
        await request(server)
          .post('/api/auth/v1/offline-sessions/revoke')
          .set('Authorization', mockCredentials.user.header())
          .send({ userEntityRef: 'user:default/target' })
          .expect(403);
        await request(server)
          .post('/api/auth/v1/offline-sessions/revoke')
          .send({ userEntityRef: 'user:default/target' })
          .expect(403);

        await request(server)
          .post('/api/auth/v1/offline-sessions/revoke')
          .set('Authorization', mockCredentials.service.header())
          .send({ userEntityRef: 'group:default/target' })
          .expect(400);
        await request(server)
          .post('/api/auth/v1/offline-sessions/revoke')
          .set('Authorization', mockCredentials.service.header())
          .send({})
          .expect(400);
        expect(auditor.createEvent).not.toHaveBeenCalled();

        // The kind and namespace default to user and default
        const res = await request(server)
          .post('/api/auth/v1/offline-sessions/revoke')
          .set('Authorization', mockCredentials.service.header())
          .send({ userEntityRef: 'target' });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ revokedCount: 2 });

        await expect(
          knex('offline_sessions').select('id').orderBy('id'),
        ).resolves.toEqual([{ id: 'c' }]);

        expect(auditor.createEvent).toHaveBeenCalledTimes(1);
        expect(auditor.createEvent).toHaveBeenCalledWith({
          eventId: 'offline-sessions-revoke',
          severityLevel: 'high',
          request: expect.anything(),
          meta: { userEntityRef: 'user:default/target' },
        });
        const event = await auditor.createEvent.mock.results[0].value;
        expect(event.success).toHaveBeenCalledWith({
          meta: { revokedCount: 2 },
        });
      },
    );

    it('should not expose the endpoint when refresh tokens are disabled', async () => {
      const { server } = await startTestBackend({
        features: [
          authPlugin,
          mockServices.rootConfig.factory({
            data: { app: { baseUrl: 'http://localhost:3000' } },
          }),
        ],
      });

      const res = await request(server)
        .post('/api/auth/v1/offline-sessions/revoke')
        .set('Authorization', mockCredentials.service.header())
        .send({ userEntityRef: 'user:default/target' });
      expect(res.status).toBe(404);
    });
  });
});

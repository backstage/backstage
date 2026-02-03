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

import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
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

    it('should omit ownership claims from the token when the config is set', async () => {
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
                omitIdentityTokenOwnershipClaim: true,
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
      expect(decoded.ent).toBeUndefined();

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
});

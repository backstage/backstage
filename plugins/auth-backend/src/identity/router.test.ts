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
} from '@backstage/backend-plugin-api';
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import Router from 'express-promise-router';
import request from 'supertest';
import { bindOidcRouter } from './router';
import { UserInfoDatabaseHandler } from './UserInfoDatabaseHandler';

describe('bindOidcRouter', () => {
  it('should return user info for full tokens', async () => {
    const auth = mockServices.auth.mock();
    const mockUserInfoDatabaseHandler = {
      getUserInfo: jest.fn().mockResolvedValue({
        claims: {
          sub: 'k/ns:n',
          ent: ['k/ns:a', 'k/ns:b'],
        },
      }),
    } as unknown as UserInfoDatabaseHandler;

    const { server } = await startTestBackend({
      features: [
        createBackendPlugin({
          pluginId: 'auth',
          register(reg) {
            reg.registerInit({
              deps: { httpRouter: coreServices.httpRouter },
              async init({ httpRouter }) {
                const router = Router();
                bindOidcRouter(router, {
                  baseUrl: 'http://localhost:7000',
                  auth,
                  tokenIssuer: {} as any,
                  userInfoDatabaseHandler: mockUserInfoDatabaseHandler,
                });
                httpRouter.use(router);
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

    auth.authenticate.mockResolvedValueOnce({} as any);
    auth.isPrincipal.mockReturnValueOnce(true);

    await request(server)
      .get('/api/auth/v1/userinfo')
      .set(
        'Authorization',
        `Bearer h.${btoa(
          JSON.stringify({ sub: 'k/ns:n', ent: ['k/ns:a', 'k/ns:b'] }),
        )}.s`,
      )
      .expect(200, {
        claims: {
          sub: 'k/ns:n',
          ent: ['k/ns:a', 'k/ns:b'],
        },
      });

    expect(mockUserInfoDatabaseHandler.getUserInfo).toHaveBeenCalledWith(
      'k/ns:n',
    );
  });

  it('should return user info for limited tokens', async () => {
    const auth = mockServices.auth.mock();
    const mockUserInfoDatabaseHandler = {
      getUserInfo: jest.fn().mockResolvedValue({
        claims: {
          sub: 'k/ns:n',
          ent: ['k/ns:a', 'k/ns:b'],
        },
      }),
    } as unknown as UserInfoDatabaseHandler;

    const { server } = await startTestBackend({
      features: [
        createBackendPlugin({
          pluginId: 'auth',
          register(reg) {
            reg.registerInit({
              deps: { httpRouter: coreServices.httpRouter },
              async init({ httpRouter }) {
                const router = Router();
                bindOidcRouter(router, {
                  baseUrl: 'http://localhost:7000',
                  auth,
                  tokenIssuer: {} as any,
                  userInfoDatabaseHandler: mockUserInfoDatabaseHandler,
                });
                httpRouter.use(router);
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

    auth.authenticate.mockResolvedValueOnce({} as any);
    auth.isPrincipal.mockReturnValueOnce(true);

    await request(server)
      .get('/api/auth/v1/userinfo')
      .set(
        'Authorization',
        `Bearer h.${btoa(JSON.stringify({ sub: 'k/ns:n' }))}.s`,
      )
      .expect(200, {
        claims: {
          sub: 'k/ns:n',
          ent: ['k/ns:a', 'k/ns:b'],
        },
      });

    expect(mockUserInfoDatabaseHandler.getUserInfo).toHaveBeenCalledWith(
      'k/ns:n',
    );
  });
});

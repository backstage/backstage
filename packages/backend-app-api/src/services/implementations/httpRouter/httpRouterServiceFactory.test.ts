/*
 * Copyright 2022 The Backstage Authors
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
  ServiceFactoryTester,
  mockCredentials,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { httpRouterServiceFactory } from './httpRouterServiceFactory';
import request from 'supertest';
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import Router from 'express-promise-router';

describe('httpRouterFactory', () => {
  it('should register plugin paths', async () => {
    const rootHttpRouter = mockServices.rootHttpRouter.mock();
    const tester = ServiceFactoryTester.from(httpRouterServiceFactory, {
      dependencies: [rootHttpRouter.factory],
    });

    const router1 = await tester.get('test1');
    router1.use(() => {});
    expect(rootHttpRouter.use).toHaveBeenCalledTimes(1);
    expect(rootHttpRouter.use).toHaveBeenCalledWith(
      '/api/test1',
      expect.any(Function),
    );

    const router2 = await tester.get('test2');
    router2.use(() => {});
    expect(rootHttpRouter.use).toHaveBeenCalledTimes(2);
    expect(rootHttpRouter.use).toHaveBeenCalledWith(
      '/api/test2',
      expect.any(Function),
    );
  });

  it('should use custom path generator', async () => {
    const rootHttpRouter = mockServices.rootHttpRouter.mock();
    const tester = ServiceFactoryTester.from(
      httpRouterServiceFactory({
        getPath: id => `/some/${id}/path`,
      }),
      { dependencies: [rootHttpRouter.factory] },
    );

    const router1 = await tester.get('test1');
    router1.use(() => {});
    expect(rootHttpRouter.use).toHaveBeenCalledTimes(1);
    expect(rootHttpRouter.use).toHaveBeenCalledWith(
      '/some/test1/path',
      expect.any(Function),
    );

    const router2 = await tester.get('test2');
    router2.use(() => {});
    expect(rootHttpRouter.use).toHaveBeenCalledTimes(2);
    expect(rootHttpRouter.use).toHaveBeenCalledWith(
      '/some/test2/path',
      expect.any(Function),
    );
  });

  describe('auth services', () => {
    const pluginSubject = createBackendPlugin({
      pluginId: 'test',
      register(reg) {
        reg.registerInit({
          deps: {
            httpRouter: coreServices.httpRouter,
            auth: coreServices.auth,
            httpAuth: coreServices.httpAuth,
          },
          async init({ httpRouter, auth, httpAuth }) {
            const router = Router();
            httpRouter.use(router);
            httpRouter.addAuthPolicy({
              path: '/public',
              allow: 'unauthenticated',
            });
            httpRouter.addAuthPolicy({
              path: '/cookie',
              allow: 'user-cookie',
            });

            router.get('/public', (_req, res) => {
              res.json({ ok: true });
            });
            router.get('/cookie', (_req, res) => {
              res.json({ ok: true });
            });
            router.get('/protected/no-checks', (_req, res) => {
              res.json({ ok: true });
            });
            router.get('/protected/only-users', async (req, res) => {
              await httpAuth.credentials(req, { allow: ['user'] });
              res.json({ ok: true });
            });
            router.get('/protected/only-services', async (req, res) => {
              await httpAuth.credentials(req, { allow: ['service'] });
              res.json({ ok: true });
            });
            router.get('/protected/credentials', async (req, res) => {
              res.json({
                credentials: await httpAuth.credentials(req),
              });
            });
            router.get('/protected/service-token', async (req, res) => {
              res.json(
                await auth.getPluginRequestToken({
                  onBehalfOf: await httpAuth.credentials(req),
                  targetPluginId: 'test',
                }),
              );
            });
          },
        });
      },
    });

    const defaultServices = [
      httpRouterServiceFactory(),
      mockServices.httpAuth.factory({
        defaultCredentials: mockCredentials.none(),
      }),
    ];

    it('should block unauthenticated requests by default', async () => {
      const { server } = await startTestBackend({
        features: [pluginSubject, ...defaultServices],
      });

      await expect(
        request(server).get('/api/test/public'),
      ).resolves.toMatchObject({
        status: 200,
      });

      // TODO: cookie

      await expect(
        request(server).get('/api/test/protected/no-checks'),
      ).resolves.toMatchObject({
        status: 401,
      });
    });

    it('should not block unauthenticated requests if default policy is disabled', async () => {
      const { server } = await startTestBackend({
        features: [
          pluginSubject,
          ...defaultServices,
          mockServices.rootConfig.factory({
            data: {
              backend: { auth: { dangerouslyDisableDefaultAuthPolicy: true } },
            },
          }),
        ],
      });

      await expect(
        request(server).get('/api/test/public'),
      ).resolves.toMatchObject({
        status: 200,
      });

      // TODO: cookie

      await expect(
        request(server).get('/api/test/protected/no-checks'),
      ).resolves.toMatchObject({
        status: 200,
        body: { ok: true },
      });

      await expect(
        request(server).get('/api/test/protected/only-users'),
      ).resolves.toMatchObject({
        status: 401,
      });

      await expect(
        request(server).get('/api/test/protected/only-services'),
      ).resolves.toMatchObject({
        status: 401,
      });

      await expect(
        request(server).get('/api/test/protected/credentials'),
      ).resolves.toMatchObject({
        status: 200,
        body: { credentials: mockCredentials.none() },
      });

      await expect(
        request(server)
          .get('/api/test/protected/credentials')
          .set('authorization', mockCredentials.user.header()),
      ).resolves.toMatchObject({
        status: 200,
        body: { credentials: mockCredentials.user() },
      });

      await expect(
        request(server)
          .get('/api/test/protected/credentials')
          .set('authorization', mockCredentials.service.header()),
      ).resolves.toMatchObject({
        status: 200,
        body: { credentials: mockCredentials.service() },
      });

      await expect(
        request(server).get('/api/test/protected/service-token'),
      ).resolves.toMatchObject({
        status: 200,
        body: { token: '' },
      });

      await expect(
        request(server)
          .get('/api/test/protected/service-token')
          .set('authorization', mockCredentials.user.header()),
      ).resolves.toMatchObject({
        status: 200,
        body: {
          token: mockCredentials.service.token({
            onBehalfOf: mockCredentials.user(),
            targetPluginId: 'test',
          }),
        },
      });

      await expect(
        request(server)
          .get('/api/test/protected/service-token')
          .set('authorization', mockCredentials.service.header()),
      ).resolves.toMatchObject({
        status: 200,
        body: {
          token: mockCredentials.service.token({
            onBehalfOf: mockCredentials.service(),
            targetPluginId: 'test',
          }),
        },
      });
    });
  });
});

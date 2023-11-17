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
  createHttpServer,
  createSpecializedBackend,
  DefaultRootHttpRouter,
  ExtendedHttpServer,
  HostDiscovery,
  MiddlewareFactory,
} from '@backstage/backend-app-api';
import {
  BackendFeature,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import {
  mockServices,
  TestBackend,
  TestBackendOptions,
} from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { decodeOAuthState } from '@backstage/plugin-auth-node';
import express from 'express';
import session from 'express-session';
import request from 'supertest';

import { authModuleVmwareCspProvider } from './module';

const secret = 'secret';

function isPromise<T>(value: unknown | Promise<T>): value is Promise<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'then' in value &&
    typeof value.then === 'function'
  );
}

function unwrapFeature(
  feature: BackendFeature | (() => BackendFeature),
): BackendFeature {
  return typeof feature === 'function' ? feature() : feature;
}

const defaultServiceFactories = [
  mockServices.cache.factory(),
  mockServices.rootConfig.factory(),
  mockServices.database.factory(),
  mockServices.httpRouter.factory(),
  mockServices.identity.factory(),
  mockServices.lifecycle.factory(),
  mockServices.logger.factory(),
  mockServices.permissions.factory(),
  mockServices.rootLifecycle.factory(),
  mockServices.rootLogger.factory(),
  mockServices.scheduler.factory(),
  mockServices.tokenManager.factory(),
  mockServices.urlReader.factory(),
];

async function createBackendWithSession<TExtensionPoints extends any[]>(
  options: TestBackendOptions<TExtensionPoints>,
): Promise<TestBackend> {
  const { extensionPoints, ...otherOptions } = options;

  // Unpack input into awaited plain BackendFeatures
  const features: BackendFeature[] = await Promise.all(
    options.features?.map(async val => {
      if (isPromise(val)) {
        const { default: feature } = await val;
        return unwrapFeature(feature);
      }
      return unwrapFeature(val);
    }) ?? [],
  );

  let server: ExtendedHttpServer;

  const rootHttpRouterFactory = createServiceFactory({
    service: coreServices.rootHttpRouter,
    deps: {
      config: coreServices.rootConfig,
      lifecycle: coreServices.rootLifecycle,
      rootLogger: coreServices.rootLogger,
    },
    async factory({ config, lifecycle, rootLogger }) {
      const router = DefaultRootHttpRouter.create();
      const logger = rootLogger.child({ service: 'rootHttpRouter' });

      const app = express();

      const middleware = MiddlewareFactory.create({ config, logger });

      app.use(
        session({
          secret,
          resave: false,
          saveUninitialized: false,
        }),
      );
      app.use(router.handler());
      app.use(middleware.notFound());
      app.use(middleware.error());

      server = await createHttpServer(
        app,
        { listen: { host: '', port: 0 } },
        { logger },
      );

      lifecycle.addShutdownHook(() => server.stop(), { logger });

      await server.start();

      return router;
    },
  });

  const discoveryFactory = createServiceFactory({
    service: coreServices.discovery,
    deps: {
      rootHttpRouter: coreServices.rootHttpRouter,
    },
    async factory() {
      if (!server) {
        throw new Error('Test server not started yet');
      }
      const port = server.port();
      const discovery = HostDiscovery.fromConfig(
        new ConfigReader({
          backend: { baseUrl: `http://localhost:${port}`, listen: { port } },
        }),
      );
      return discovery;
    },
  });

  const backend = createSpecializedBackend({
    ...otherOptions,
    defaultServiceFactories: [
      ...defaultServiceFactories,
      rootHttpRouterFactory,
      discoveryFactory,
    ],
  });

  for (const feature of features) {
    backend.add(feature);
  }

  await backend.start();

  return Object.assign(backend, {
    get server() {
      if (!server) {
        throw new Error('TestBackend server is not available');
      }
      return server;
    },
  });
}

describe('authModuleVmwareCspProvider', () => {
  it('should start', async () => {
    const backend = await createBackendWithSession({
      features: [
        import('@backstage/plugin-auth-backend'),
        authModuleVmwareCspProvider,
        mockServices.rootConfig.factory({
          data: {
            app: {
              baseUrl: 'http://localhost:3000',
            },
            auth: {
              providers: {
                vmwareCloudServices: {
                  development: {
                    clientId: 'placeholderClientId',
                    organizationId: 'orgId',
                  },
                },
              },
            },
          },
        }),
      ],
    });

    const { server } = backend;

    const agent = request.agent(server);

    const res = await agent.get(
      '/api/auth/vmwareCloudServices/start?env=development',
    );

    expect(res.status).toEqual(302);

    const nonceCookie = agent.jar.getCookie('vmwareCloudServices-nonce', {
      domain: 'localhost',
      path: '/api/auth/vmwareCloudServices/handler',
      script: false,
      secure: false,
    });
    expect(nonceCookie).toBeDefined();

    const startUrl = new URL(res.get('location'));
    expect(startUrl.origin).toBe('https://console.cloud.vmware.com');
    expect(startUrl.pathname).toBe('/csp/gateway/discovery');
    expect(Object.fromEntries(startUrl.searchParams)).toEqual({
      response_type: 'code',
      client_id: 'placeholderClientId',
      redirect_uri: `http://localhost:${server.port()}/api/auth/vmwareCloudServices/handler/frame`,
      code_challenge: expect.any(String),
      state: expect.any(String),
      scope: 'openid offline_access',
      orgId: 'orgId',
      code_challenge_method: 'S256',
    });

    expect(decodeOAuthState(startUrl.searchParams.get('state')!)).toEqual({
      env: 'development',
      handle: expect.any(String),
      nonce: decodeURIComponent(nonceCookie.value),
    });

    backend.stop();
  });
});

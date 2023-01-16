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
  Backend,
  createSpecializedBackend,
  MiddlewareFactory,
  createHttpServer,
  ExtendedHttpServer,
  DefaultRootHttpRouter,
} from '@backstage/backend-app-api';
import { SingleHostDiscovery } from '@backstage/backend-common';
import {
  ServiceFactory,
  ServiceRef,
  createServiceFactory,
  BackendFeature,
  ExtensionPoint,
  coreServices,
} from '@backstage/backend-plugin-api';

import { mockFactories } from '../implementations';
import { ConfigReader } from '@backstage/config';
import express from 'express';

/** @alpha */
export interface TestBackendOptions<
  TServices extends any[],
  TExtensionPoints extends any[],
> {
  services?: readonly [
    ...{
      [index in keyof TServices]:
        | ServiceFactory<TServices[index]>
        | (() => ServiceFactory<TServices[index]>)
        | [ServiceRef<TServices[index]>, Partial<TServices[index]>];
    },
  ];
  extensionPoints?: readonly [
    ...{
      [index in keyof TExtensionPoints]: [
        ExtensionPoint<TExtensionPoints[index]>,
        Partial<TExtensionPoints[index]>,
      ];
    },
  ];
  features?: BackendFeature[];
}

/** @alpha */
export interface TestBackend extends Backend {
  /**
   * Provides access to the underling HTTP server for use with utilities
   * such as `supertest`.
   *
   * If the root http router service has been replaced, this will throw an error.
   */
  readonly server: ExtendedHttpServer;
}

const defaultServiceFactories = [
  mockFactories.cache(),
  mockFactories.database(),
  mockFactories.httpRouter(),
  mockFactories.lifecycle(),
  mockFactories.logger(),
  mockFactories.config(),
  mockFactories.identity(),
  mockFactories.tokenManager(),
  mockFactories.permissions(),
  mockFactories.rootLifecycle(),
  mockFactories.scheduler(),
  mockFactories.urlReader(),
];

const backendInstancesToCleanUp = new Array<Backend>();

/** @alpha */
export async function startTestBackend<
  TServices extends any[],
  TExtensionPoints extends any[],
>(
  options: TestBackendOptions<TServices, TExtensionPoints>,
): Promise<TestBackend> {
  const {
    services = [],
    extensionPoints = [],
    features = [],
    ...otherOptions
  } = options;

  let server: ExtendedHttpServer;

  const rootHttpRouterFactory = createServiceFactory({
    service: coreServices.rootHttpRouter,
    deps: {
      config: coreServices.config,
      lifecycle: coreServices.rootLifecycle,
      rootLogger: coreServices.rootLogger,
    },
    async factory({ config, lifecycle, rootLogger }) {
      const router = DefaultRootHttpRouter.create();
      const logger = rootLogger.child({ service: 'rootHttpRouter' });

      const app = express();

      const middleware = MiddlewareFactory.create({ config, logger });

      app.use(router.handler());
      app.use(middleware.notFound());
      app.use(middleware.error());

      server = await createHttpServer(
        app,
        { listen: { host: '', port: 0 } },
        { logger },
      );

      lifecycle.addShutdownHook({
        async fn() {
          await server.stop();
        },
        logger,
      });

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
      const discovery = SingleHostDiscovery.fromConfig(
        new ConfigReader({
          backend: { baseUrl: `http://localhost:${port}`, listen: { port } },
        }),
      );
      return discovery;
    },
  });

  const factories = services.map(serviceDef => {
    if (Array.isArray(serviceDef)) {
      // if type is ExtensionPoint?
      // do something differently?
      const [ref, impl] = serviceDef;
      if (ref.scope === 'plugin') {
        return createServiceFactory({
          service: ref as ServiceRef<unknown, 'plugin'>,
          deps: {},
          factory: async () => impl,
        })();
      }
      return createServiceFactory({
        service: ref as ServiceRef<unknown, 'root'>,
        deps: {},
        factory: async () => impl,
      })();
    }
    if (typeof serviceDef === 'function') {
      return serviceDef();
    }
    return serviceDef as ServiceFactory;
  });

  for (const factory of defaultServiceFactories) {
    if (!factories.some(f => f.service.id === factory.service.id)) {
      factories.push(factory);
    }
  }

  const backend = createSpecializedBackend({
    ...otherOptions,
    services: [...factories, rootHttpRouterFactory, discoveryFactory],
  });

  backendInstancesToCleanUp.push(backend);

  backend.add({
    id: `---test-extension-point-registrar`,
    register(reg) {
      for (const [ref, impl] of extensionPoints) {
        reg.registerExtensionPoint(ref, impl);
      }

      reg.registerInit({ deps: {}, async init() {} });
    },
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

let registered = false;
function registerTestHooks() {
  if (typeof afterAll !== 'function') {
    return;
  }
  if (registered) {
    return;
  }
  registered = true;

  afterAll(async () => {
    await Promise.all(
      backendInstancesToCleanUp.map(async backend => {
        try {
          await backend.stop();
        } catch (error) {
          console.error(`Failed to stop backend after tests, ${error}`);
        }
      }),
    );
    backendInstancesToCleanUp.length = 0;
  });
}

registerTestHooks();

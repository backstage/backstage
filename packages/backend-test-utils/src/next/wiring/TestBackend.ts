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
  lifecycleFactory,
  rootLifecycleFactory,
  loggerFactory,
  rootLoggerFactory,
  cacheFactory,
  permissionsFactory,
  schedulerFactory,
  urlReaderFactory,
  databaseFactory,
  httpRouterFactory,
} from '@backstage/backend-app-api';
import {
  createServiceBuilder,
  SingleHostDiscovery,
} from '@backstage/backend-common';
import { Handler } from 'express';
import * as http from 'http';
import Router from 'express-promise-router';
import {
  ServiceFactory,
  ServiceRef,
  createServiceFactory,
  BackendFeature,
  ExtensionPoint,
  coreServices,
} from '@backstage/backend-plugin-api';

import { mockConfigFactory, mockTokenManagerFactory } from '../implementations';
import { AddressInfo } from 'net';
import { ConfigReader } from '@backstage/config';

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

const defaultServiceFactories = [
  cacheFactory(),
  databaseFactory(),
  httpRouterFactory(),
  lifecycleFactory(),
  loggerFactory(),
  mockConfigFactory(),
  mockTokenManagerFactory(),
  permissionsFactory(),
  rootLifecycleFactory(),
  rootLoggerFactory(),
  schedulerFactory(),
  urlReaderFactory(),
];

const backendInstancesToCleanUp = new Array<Backend>();

/** @alpha */
export async function startTestBackend<
  TServices extends any[],
  TExtensionPoints extends any[],
>(options: TestBackendOptions<TServices, TExtensionPoints>): Promise<Backend> {
  const {
    services = [],
    extensionPoints = [],
    features = [],
    ...otherOptions
  } = options;

  let server: http.Server;

  const rootHttpRouterFactory = createServiceFactory({
    service: coreServices.rootHttpRouter,
    deps: {
      config: coreServices.config,
      lifecycle: coreServices.rootLifecycle,
    },
    async factory({ config, lifecycle }) {
      const router = Router();

      const service = createServiceBuilder(module)
        .loadConfig(config)
        .setPort(0);

      service.addRouter('', router);

      server = await service.start();
      // Stop method isn't part of the public API, let's fix that once we move the implementation here.
      const stoppableServer = server as typeof server & {
        stop: (cb: (error?: Error) => void) => void;
      };

      lifecycle.addShutdownHook({
        async fn() {
          await new Promise<void>((resolve, reject) => {
            stoppableServer.stop((error?: Error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          });
        },
        labels: { service: 'rootHttpRouter' },
      });

      return {
        use: (path: string, handler: Handler) => {
          router.use(path, handler);
        },
      };
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
      const { port } = server.address() as AddressInfo;
      const discovery = SingleHostDiscovery.fromConfig(
        new ConfigReader({
          backend: { baseUrl: `http://localhost:${port}`, listen: { port } },
        }),
      );
      return async () => discovery;
    },
  });

  const factories = services.map(serviceDef => {
    if (Array.isArray(serviceDef)) {
      // if type is ExtensionPoint?
      // do something differently?
      const [ref, impl] = serviceDef;
      if (ref.scope === 'plugin') {
        return createServiceFactory({
          service: ref,
          deps: {},
          factory: async () => async () => impl,
        })();
      }
      return createServiceFactory({
        service: ref,
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

  return Object.assign(backend, { server: server! }) as Backend;
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

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
import { HostDiscovery } from '@backstage/backend-common';
import {
  createServiceFactory,
  BackendFeature,
  ExtensionPoint,
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { mockServices } from '../services';
import { ConfigReader } from '@backstage/config';
import express from 'express';
// Direct internal import to avoid duplication
// eslint-disable-next-line @backstage/no-forbidden-package-imports
import { InternalBackendFeature } from '@backstage/backend-plugin-api/src/wiring/types';

/** @public */
export interface TestBackendOptions<TExtensionPoints extends any[]> {
  extensionPoints?: readonly [
    ...{
      [index in keyof TExtensionPoints]: [
        ExtensionPoint<TExtensionPoints[index]>,
        Partial<TExtensionPoints[index]>,
      ];
    },
  ];
  features?: Array<
    | BackendFeature
    | (() => BackendFeature)
    | Promise<{ default: BackendFeature | (() => BackendFeature) }>
  >;
}

/** @public */
export interface TestBackend extends Backend {
  /**
   * Provides access to the underling HTTP server for use with utilities
   * such as `supertest`.
   *
   * If the root http router service has been replaced, this will throw an error.
   */
  readonly server: ExtendedHttpServer;
}

export const defaultServiceFactories = [
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

/**
 * Given a set of extension points and features, find the extension
 * points that we mock and tie them to the correct plugin ID.
 * @returns
 */
function createExtensionPointTestModules(
  features: Array<BackendFeature>,
  extensionPointTuples?: readonly [
    ref: ExtensionPoint<unknown>,
    impl: unknown,
  ][],
): Array<() => BackendFeature> {
  if (!extensionPointTuples) {
    return [];
  }

  const registrations = features.flatMap(feature => {
    if (feature.$$type !== '@backstage/BackendFeature') {
      throw new Error(
        `Failed to add feature, invalid type '${feature.$$type}'`,
      );
    }

    if (isInternalBackendFeature(feature)) {
      if (feature.version !== 'v1') {
        throw new Error(
          `Failed to add feature, invalid version '${feature.version}'`,
        );
      }
      return feature.getRegistrations();
    }
    return [];
  });

  const extensionPointMap = new Map(
    extensionPointTuples.map(ep => [ep[0].id, ep]),
  );
  const extensionPointsToSort = new Set(extensionPointMap.keys());
  const extensionPointsByPlugin = new Map<string, string[]>();

  for (const registration of registrations) {
    if (registration.type === 'module') {
      const testDep = Object.values(registration.init.deps).filter(dep =>
        extensionPointsToSort.has(dep.id),
      );
      if (testDep.length > 0) {
        let points = extensionPointsByPlugin.get(registration.pluginId);
        if (!points) {
          points = [];
          extensionPointsByPlugin.set(registration.pluginId, points);
        }
        for (const { id } of testDep) {
          points.push(id);
          extensionPointsToSort.delete(id);
        }
      }
    }
  }

  if (extensionPointsToSort.size > 0) {
    const list = Array.from(extensionPointsToSort)
      .map(id => `'${id}'`)
      .join(', ');
    throw new Error(
      `Unable to determine the plugin ID of extension point(s) ${list}. ` +
        'Tested extension points must be depended on by one or more tested modules.',
    );
  }

  const modules = [];

  for (const [pluginId, pluginExtensionPointIds] of extensionPointsByPlugin) {
    modules.push(
      createBackendModule({
        pluginId,
        moduleId: 'testExtensionPointRegistration',
        register(reg) {
          for (const id of pluginExtensionPointIds) {
            const tuple = extensionPointMap.get(id)!;
            reg.registerExtensionPoint(...tuple);
          }

          reg.registerInit({ deps: {}, async init() {} });
        },
      }),
    );
  }

  return modules;
}

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

const backendInstancesToCleanUp = new Array<Backend>();

/** @public */
export async function startTestBackend<TExtensionPoints extends any[]>(
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

  backendInstancesToCleanUp.push(backend);

  for (const m of createExtensionPointTestModules(features, extensionPoints)) {
    backend.add(m);
  }

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

function isInternalBackendFeature(
  feature: BackendFeature,
): feature is InternalBackendFeature {
  return (
    typeof (feature as InternalBackendFeature).getRegistrations === 'function'
  );
}

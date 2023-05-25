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
  BackendFeature,
  ExtensionPoint,
  coreServices,
  ServiceRef,
} from '@backstage/backend-plugin-api';
import { BackendLifecycleImpl } from '../services/implementations/rootLifecycle/rootLifecycleServiceFactory';
import { BackendPluginLifecycleImpl } from '../services/implementations/lifecycle/lifecycleServiceFactory';
import { EnumerableServiceHolder, ServiceOrExtensionPoint } from './types';
// Direct internal import to avoid duplication
// eslint-disable-next-line @backstage/no-forbidden-package-imports
import { InternalBackendFeature } from '@backstage/backend-plugin-api/src/wiring/types';

export interface BackendRegisterInit {
  consumes: Set<ServiceOrExtensionPoint>;
  provides: Set<ServiceOrExtensionPoint>;
  init: {
    deps: { [name: string]: ServiceOrExtensionPoint };
    func: (deps: { [name: string]: unknown }) => Promise<void>;
  };
}

export class BackendInitializer {
  #startPromise?: Promise<void>;
  #features = new Array<InternalBackendFeature>();
  #extensionPoints = new Map<ExtensionPoint<unknown>, unknown>();
  #serviceHolder: EnumerableServiceHolder;

  constructor(serviceHolder: EnumerableServiceHolder) {
    this.#serviceHolder = serviceHolder;
  }

  async #getInitDeps(
    deps: { [name: string]: ServiceOrExtensionPoint },
    pluginId: string,
  ) {
    const result = new Map<string, unknown>();
    const missingRefs = new Set<ServiceOrExtensionPoint>();

    for (const [name, ref] of Object.entries(deps)) {
      const extensionPoint = this.#extensionPoints.get(
        ref as ExtensionPoint<unknown>,
      );
      if (extensionPoint) {
        result.set(name, extensionPoint);
      } else {
        const impl = await this.#serviceHolder.get(
          ref as ServiceRef<unknown>,
          pluginId,
        );
        if (impl) {
          result.set(name, impl);
        } else {
          missingRefs.add(ref);
        }
      }
    }

    if (missingRefs.size > 0) {
      const missing = Array.from(missingRefs).join(', ');
      throw new Error(
        `No extension point or service available for the following ref(s): ${missing}`,
      );
    }

    return Object.fromEntries(result);
  }

  add(feature: BackendFeature) {
    if (this.#startPromise) {
      throw new Error('feature can not be added after the backend has started');
    }
    if (feature.$$type !== '@backstage/BackendFeature') {
      throw new Error(
        `Failed to add feature, invalid type '${feature.$$type}'`,
      );
    }
    const internalFeature = feature as InternalBackendFeature;
    if (internalFeature.version !== 'v1') {
      throw new Error(
        `Failed to add feature, invalid version '${internalFeature.version}'`,
      );
    }
    this.#features.push(internalFeature);
  }

  async start(): Promise<void> {
    if (this.#startPromise) {
      throw new Error('Backend has already started');
    }

    const exitHandler = async () => {
      process.removeListener('SIGTERM', exitHandler);
      process.removeListener('SIGINT', exitHandler);
      process.removeListener('beforeExit', exitHandler);

      try {
        await this.stop();
        process.exit(0);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    };

    process.addListener('SIGTERM', exitHandler);
    process.addListener('SIGINT', exitHandler);
    process.addListener('beforeExit', exitHandler);

    this.#startPromise = this.#doStart();
    await this.#startPromise;
  }

  async #doStart(): Promise<void> {
    // Initialize all root scoped services
    for (const ref of this.#serviceHolder.getServiceRefs()) {
      if (ref.scope === 'root') {
        await this.#serviceHolder.get(ref, 'root');
      }
    }

    const pluginInits = new Map<string, BackendRegisterInit>();
    const moduleInits = new Map<string, Map<string, BackendRegisterInit>>();

    // Enumerate all features
    for (const feature of this.#features) {
      for (const r of feature.getRegistrations()) {
        const provides = new Set<ExtensionPoint<unknown>>();

        if (r.type === 'plugin') {
          for (const [extRef, extImpl] of r.extensionPoints) {
            if (this.#extensionPoints.has(extRef)) {
              throw new Error(
                `ExtensionPoint with ID '${extRef.id}' is already registered`,
              );
            }
            this.#extensionPoints.set(extRef, extImpl);
            provides.add(extRef);
          }
        }

        if (r.type === 'plugin') {
          if (pluginInits.has(r.pluginId)) {
            throw new Error(`Plugin '${r.pluginId}' is already registered`);
          }
          pluginInits.set(r.pluginId, {
            provides,
            consumes: new Set(Object.values(r.init.deps)),
            init: r.init,
          });
        } else {
          let modules = moduleInits.get(r.pluginId);
          if (!modules) {
            modules = new Map();
            moduleInits.set(r.pluginId, modules);
          }
          if (modules.has(r.moduleId)) {
            throw new Error(
              `Module '${r.moduleId}' for plugin '${r.pluginId}' is already registered`,
            );
          }
          modules.set(r.moduleId, {
            provides,
            consumes: new Set(Object.values(r.init.deps)),
            init: r.init,
          });
        }
      }
    }

    const allPluginIds = [
      ...new Set([...pluginInits.keys(), ...moduleInits.keys()]),
    ];

    // All plugins are initialized in parallel
    await Promise.all(
      allPluginIds.map(async pluginId => {
        // Modules are initialized before plugins, so that they can provide extension to the plugin
        const modules = moduleInits.get(pluginId) ?? [];
        await Promise.all(
          Array.from(modules.values()).map(async moduleInit => {
            const moduleDeps = await this.#getInitDeps(
              moduleInit.init.deps,
              pluginId,
            );
            await moduleInit.init.func(moduleDeps);
          }),
        );

        // Once all modules have been initialized, we can initialize the plugin itself
        const pluginInit = pluginInits.get(pluginId);
        // We allow modules to be installed without the accompanying plugin, so the plugin may not exist
        if (pluginInit) {
          const pluginDeps = await this.#getInitDeps(
            pluginInit.init.deps,
            pluginId,
          );
          await pluginInit.init.func(pluginDeps);
        }

        // Once the plugin and all modules have been initialized, we can signal that the plugin has stared up successfully
        const lifecycleService = await this.#getPluginLifecycleImpl(pluginId);
        await lifecycleService.startup();
      }),
    );

    // Once all plugins and modules have been initialized, we can signal that the backend has started up successfully
    const lifecycleService = await this.#getRootLifecycleImpl();
    await lifecycleService.startup();

    // Once the backend is started, any uncaught errors or unhandled rejections are caught
    // and logged, in order to avoid crashing the entire backend on local failures.
    if (process.env.NODE_ENV !== 'test') {
      const rootLogger = await this.#serviceHolder.get(
        coreServices.rootLogger,
        'root',
      );
      process.on('unhandledRejection', (reason: Error) => {
        rootLogger
          ?.child({ type: 'unhandledRejection' })
          ?.error('Unhandled rejection', reason);
      });
      process.on('uncaughtException', error => {
        rootLogger
          ?.child({ type: 'uncaughtException' })
          ?.error('Uncaught exception', error);
      });
    }
  }

  async stop(): Promise<void> {
    if (!this.#startPromise) {
      return;
    }
    await this.#startPromise;

    const lifecycleService = await this.#getRootLifecycleImpl();
    await lifecycleService.shutdown();
  }

  // Bit of a hacky way to grab the lifecycle services, potentially find a nicer way to do this
  async #getRootLifecycleImpl(): Promise<BackendLifecycleImpl> {
    const lifecycleService = await this.#serviceHolder.get(
      coreServices.rootLifecycle,
      'root',
    );
    if (lifecycleService instanceof BackendLifecycleImpl) {
      return lifecycleService;
    }
    throw new Error('Unexpected root lifecycle service implementation');
  }

  async #getPluginLifecycleImpl(
    pluginId: string,
  ): Promise<BackendPluginLifecycleImpl> {
    const lifecycleService = await this.#serviceHolder.get(
      coreServices.lifecycle,
      pluginId,
    );
    if (lifecycleService instanceof BackendPluginLifecycleImpl) {
      return lifecycleService;
    }
    throw new Error('Unexpected plugin lifecycle service implementation');
  }
}

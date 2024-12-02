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
  ServiceFactory,
  LifecycleService,
  RootLifecycleService,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { ServiceOrExtensionPoint } from './types';
// Direct internal import to avoid duplication
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type {
  InternalBackendFeature,
  InternalBackendFeatureLoader,
  InternalBackendRegistrations,
} from '../../../backend-plugin-api/src/wiring/types';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import type { InternalServiceFactory } from '../../../backend-plugin-api/src/services/system/types';
import { ForwardedError, ConflictError } from '@backstage/errors';
import {
  instanceMetadataServiceRef,
  featureDiscoveryServiceRef,
  BackendFeatureMeta,
} from '@backstage/backend-plugin-api/alpha';
import { DependencyGraph } from '../lib/DependencyGraph';
import { ServiceRegistry } from './ServiceRegistry';
import { createInitializationLogger } from './createInitializationLogger';
import { unwrapFeature } from './helpers';

export interface BackendRegisterInit {
  consumes: Set<ServiceOrExtensionPoint>;
  provides: Set<ServiceOrExtensionPoint>;
  init: {
    deps: { [name: string]: ServiceOrExtensionPoint };
    func: (deps: { [name: string]: unknown }) => Promise<void>;
  };
}

/**
 * A registry of backend instances, used to manage process shutdown hooks across all instances.
 */
const instanceRegistry = new (class InstanceRegistry {
  #registered = false;
  #instances = new Set<BackendInitializer>();

  register(instance: BackendInitializer) {
    if (!this.#registered) {
      this.#registered = true;

      process.addListener('SIGTERM', this.#exitHandler);
      process.addListener('SIGINT', this.#exitHandler);
      process.addListener('beforeExit', this.#exitHandler);
    }

    this.#instances.add(instance);
  }

  unregister(instance: BackendInitializer) {
    this.#instances.delete(instance);
  }

  #exitHandler = async () => {
    try {
      const results = await Promise.allSettled(
        Array.from(this.#instances).map(b => b.stop()),
      );
      const errors = results.flatMap(r =>
        r.status === 'rejected' ? [r.reason] : [],
      );

      if (errors.length > 0) {
        for (const error of errors) {
          console.error(error);
        }
        process.exit(1);
      } else {
        process.exit(0);
      }
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };
})();

function createInstanceMetadataServiceFactory(
  registrations: InternalBackendRegistrations[],
) {
  const installedFeatures = registrations
    .map(registration => {
      if (registration.featureType === 'registrations') {
        return registration
          .getRegistrations()
          .map(feature => {
            if (feature.type === 'plugin') {
              return { type: 'plugin', pluginId: feature.pluginId };
            } else if (feature.type === 'module') {
              return {
                type: 'module',
                pluginId: feature.pluginId,
                moduleId: feature.moduleId,
              };
            }
            // Ignore unknown feature types.
            return undefined;
          })
          .filter(Boolean) as BackendFeatureMeta[];
      }
      return [];
    })
    .flat();
  return createServiceFactory({
    service: instanceMetadataServiceRef,
    deps: {},
    factory: async () => ({ getInstalledFeatures: () => installedFeatures }),
  });
}

export class BackendInitializer {
  #startPromise?: Promise<void>;
  #stopPromise?: Promise<void>;
  #registrations = new Array<InternalBackendRegistrations>();
  #extensionPoints = new Map<string, { impl: unknown; pluginId: string }>();
  #serviceRegistry: ServiceRegistry;
  #registeredFeatures = new Array<Promise<BackendFeature>>();
  #registeredFeatureLoaders = new Array<InternalBackendFeatureLoader>();

  constructor(defaultApiFactories: ServiceFactory[]) {
    this.#serviceRegistry = ServiceRegistry.create([...defaultApiFactories]);
  }

  async #getInitDeps(
    deps: { [name: string]: ServiceOrExtensionPoint },
    pluginId: string,
    moduleId?: string,
  ) {
    const result = new Map<string, unknown>();
    const missingRefs = new Set<ServiceOrExtensionPoint>();

    for (const [name, ref] of Object.entries(deps)) {
      const ep = this.#extensionPoints.get(ref.id);
      if (ep) {
        if (ep.pluginId !== pluginId) {
          throw new Error(
            `Illegal dependency: Module '${moduleId}' for plugin '${pluginId}' attempted to depend on extension point '${ref.id}' for plugin '${ep.pluginId}'. Extension points can only be used within their plugin's scope.`,
          );
        }
        result.set(name, ep.impl);
      } else {
        const impl = await this.#serviceRegistry.get(
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
      const target = moduleId
        ? `module '${moduleId}' for plugin '${pluginId}'`
        : `plugin '${pluginId}'`;
      throw new Error(
        `Service or extension point dependencies of ${target} are missing for the following ref(s): ${missing}`,
      );
    }

    return Object.fromEntries(result);
  }

  add(feature: BackendFeature | Promise<BackendFeature>) {
    if (this.#startPromise) {
      throw new Error('feature can not be added after the backend has started');
    }
    this.#registeredFeatures.push(Promise.resolve(feature));
  }

  #addFeature(feature: BackendFeature) {
    if (isServiceFactory(feature)) {
      this.#serviceRegistry.add(feature);
    } else if (isBackendFeatureLoader(feature)) {
      this.#registeredFeatureLoaders.push(feature);
    } else if (isBackendRegistrations(feature)) {
      this.#registrations.push(feature);
    } else {
      throw new Error(
        `Failed to add feature, invalid feature ${JSON.stringify(feature)}`,
      );
    }
  }

  async start(): Promise<void> {
    if (this.#startPromise) {
      throw new Error('Backend has already started');
    }
    if (this.#stopPromise) {
      throw new Error('Backend has already stopped');
    }

    instanceRegistry.register(this);

    this.#startPromise = this.#doStart();
    await this.#startPromise;
  }

  async #doStart(): Promise<void> {
    this.#serviceRegistry.checkForCircularDeps();

    for (const feature of this.#registeredFeatures) {
      this.#addFeature(await feature);
    }

    const featureDiscovery = await this.#serviceRegistry.get(
      // TODO: Let's leave this in place and remove it once the deprecated service is removed. We can do that post-1.0 since it's alpha
      featureDiscoveryServiceRef,
      'root',
    );

    if (featureDiscovery) {
      const { features } = await featureDiscovery.getBackendFeatures();
      for (const feature of features) {
        this.#addFeature(unwrapFeature(feature));
      }
      this.#serviceRegistry.checkForCircularDeps();
    }

    await this.#applyBackendFeatureLoaders(this.#registeredFeatureLoaders);

    this.#serviceRegistry.add(
      createInstanceMetadataServiceFactory(this.#registrations),
    );

    // Initialize all root scoped services
    await this.#serviceRegistry.initializeEagerServicesWithScope('root');

    const pluginInits = new Map<string, BackendRegisterInit>();
    const moduleInits = new Map<string, Map<string, BackendRegisterInit>>();

    // Enumerate all registrations
    for (const feature of this.#registrations) {
      for (const r of feature.getRegistrations()) {
        const provides = new Set<ExtensionPoint<unknown>>();

        if (r.type === 'plugin' || r.type === 'module') {
          for (const [extRef, extImpl] of r.extensionPoints) {
            if (this.#extensionPoints.has(extRef.id)) {
              throw new Error(
                `ExtensionPoint with ID '${extRef.id}' is already registered`,
              );
            }
            this.#extensionPoints.set(extRef.id, {
              impl: extImpl,
              pluginId: r.pluginId,
            });
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
        } else if (r.type === 'module') {
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
        } else {
          throw new Error(`Invalid registration type '${(r as any).type}'`);
        }
      }
    }

    const allPluginIds = [...pluginInits.keys()];

    const initLogger = createInitializationLogger(
      allPluginIds,
      await this.#serviceRegistry.get(coreServices.rootLogger, 'root'),
    );

    // All plugins are initialized in parallel
    const results = await Promise.allSettled(
      allPluginIds.map(async pluginId => {
        try {
          // Initialize all eager services
          await this.#serviceRegistry.initializeEagerServicesWithScope(
            'plugin',
            pluginId,
          );

          // Modules are initialized before plugins, so that they can provide extension to the plugin
          const modules = moduleInits.get(pluginId);
          if (modules) {
            const tree = DependencyGraph.fromIterable(
              Array.from(modules).map(([moduleId, moduleInit]) => ({
                value: { moduleId, moduleInit },
                // Relationships are reversed at this point since we're only interested in the extension points.
                // If a modules provides extension point A we want it to be initialized AFTER all modules
                // that depend on extension point A, so that they can provide their extensions.
                consumes: Array.from(moduleInit.provides).map(p => p.id),
                provides: Array.from(moduleInit.consumes).map(c => c.id),
              })),
            );
            const circular = tree.detectCircularDependency();
            if (circular) {
              throw new ConflictError(
                `Circular dependency detected for modules of plugin '${pluginId}', ${circular
                  .map(({ moduleId }) => `'${moduleId}'`)
                  .join(' -> ')}`,
              );
            }
            await tree.parallelTopologicalTraversal(
              async ({ moduleId, moduleInit }) => {
                const moduleDeps = await this.#getInitDeps(
                  moduleInit.init.deps,
                  pluginId,
                  moduleId,
                );
                await moduleInit.init.func(moduleDeps).catch(error => {
                  throw new ForwardedError(
                    `Module '${moduleId}' for plugin '${pluginId}' startup failed`,
                    error,
                  );
                });
              },
            );
          }

          // Once all modules have been initialized, we can initialize the plugin itself
          const pluginInit = pluginInits.get(pluginId);
          // We allow modules to be installed without the accompanying plugin, so the plugin may not exist
          if (pluginInit) {
            const pluginDeps = await this.#getInitDeps(
              pluginInit.init.deps,
              pluginId,
            );
            await pluginInit.init.func(pluginDeps).catch(error => {
              throw new ForwardedError(
                `Plugin '${pluginId}' startup failed`,
                error,
              );
            });
          }

          initLogger.onPluginStarted(pluginId);

          // Once the plugin and all modules have been initialized, we can signal that the plugin has stared up successfully
          const lifecycleService = await this.#getPluginLifecycleImpl(pluginId);
          await lifecycleService.startup();
        } catch (error) {
          initLogger.onPluginFailed(pluginId);
          throw error;
        }
      }),
    );

    const initErrors = results.flatMap(r =>
      r.status === 'rejected' ? [r.reason] : [],
    );
    if (initErrors.length === 1) {
      throw initErrors[0];
    } else if (initErrors.length > 1) {
      // TODO(Rugvip): Seems like there aren't proper types for AggregateError yet
      throw new (AggregateError as any)(initErrors, 'Backend startup failed');
    }

    // Once all plugins and modules have been initialized, we can signal that the backend has started up successfully
    const lifecycleService = await this.#getRootLifecycleImpl();
    await lifecycleService.startup();

    initLogger.onAllStarted();

    // Once the backend is started, any uncaught errors or unhandled rejections are caught
    // and logged, in order to avoid crashing the entire backend on local failures.
    if (process.env.NODE_ENV !== 'test') {
      const rootLogger = await this.#serviceRegistry.get(
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

  // It's fine to call .stop() multiple times, which for example can happen with manual stop + process exit
  async stop(): Promise<void> {
    instanceRegistry.unregister(this);

    if (!this.#stopPromise) {
      this.#stopPromise = this.#doStop();
    }
    await this.#stopPromise;
  }

  async #doStop(): Promise<void> {
    if (!this.#startPromise) {
      return;
    }

    try {
      await this.#startPromise;
    } catch (error) {
      // The startup failed, but we may still want to do cleanup so we continue silently
    }

    // Get all plugins.
    const allPlugins = new Set<string>();
    for (const feature of this.#registrations) {
      for (const r of feature.getRegistrations()) {
        if (r.type === 'plugin') {
          allPlugins.add(r.pluginId);
        }
      }
    }

    // Iterate through all plugins and run their shutdown hooks.
    await Promise.allSettled(
      [...allPlugins].map(async pluginId => {
        const lifecycleService = await this.#getPluginLifecycleImpl(pluginId);
        await lifecycleService.shutdown();
      }),
    );

    // Once all plugin shutdown hooks are done, run root shutdown hooks.
    const lifecycleService = await this.#getRootLifecycleImpl();
    await lifecycleService.shutdown();
  }

  // Bit of a hacky way to grab the lifecycle services, potentially find a nicer way to do this
  async #getRootLifecycleImpl(): Promise<
    RootLifecycleService & {
      startup(): Promise<void>;
      shutdown(): Promise<void>;
    }
  > {
    const lifecycleService = await this.#serviceRegistry.get(
      coreServices.rootLifecycle,
      'root',
    );

    const service = lifecycleService as any;
    if (
      service &&
      typeof service.startup === 'function' &&
      typeof service.shutdown === 'function'
    ) {
      return service;
    }

    throw new Error('Unexpected root lifecycle service implementation');
  }

  async #getPluginLifecycleImpl(
    pluginId: string,
  ): Promise<
    LifecycleService & { startup(): Promise<void>; shutdown(): Promise<void> }
  > {
    const lifecycleService = await this.#serviceRegistry.get(
      coreServices.lifecycle,
      pluginId,
    );

    const service = lifecycleService as any;
    if (
      service &&
      typeof service.startup === 'function' &&
      typeof service.shutdown === 'function'
    ) {
      return service;
    }

    throw new Error('Unexpected plugin lifecycle service implementation');
  }

  async #applyBackendFeatureLoaders(loaders: InternalBackendFeatureLoader[]) {
    for (const loader of loaders) {
      const deps = new Map<string, unknown>();
      const missingRefs = new Set<ServiceOrExtensionPoint>();

      for (const [name, ref] of Object.entries(loader.deps ?? {})) {
        if (ref.scope !== 'root') {
          throw new Error(
            `Feature loaders can only depend on root scoped services, but '${name}' is scoped to '${ref.scope}'. Offending loader is ${loader.description}`,
          );
        }
        const impl = await this.#serviceRegistry.get(
          ref as ServiceRef<unknown>,
          'root',
        );
        if (impl) {
          deps.set(name, impl);
        } else {
          missingRefs.add(ref);
        }
      }

      if (missingRefs.size > 0) {
        const missing = Array.from(missingRefs).join(', ');
        throw new Error(
          `No service available for the following ref(s): ${missing}, depended on by feature loader ${loader.description}`,
        );
      }

      const result = await loader
        .loader(Object.fromEntries(deps))
        .then(features => features.map(unwrapFeature))
        .catch(error => {
          throw new ForwardedError(
            `Feature loader ${loader.description} failed`,
            error,
          );
        });

      let didAddServiceFactory = false;
      const newLoaders = new Array<InternalBackendFeatureLoader>();

      for await (const feature of result) {
        if (isBackendFeatureLoader(feature)) {
          newLoaders.push(feature);
        } else {
          didAddServiceFactory ||= isServiceFactory(feature);
          this.#addFeature(feature);
        }
      }

      // Every time we add a new service factory we need to make sure that we don't have circular dependencies
      if (didAddServiceFactory) {
        this.#serviceRegistry.checkForCircularDeps();
      }

      // Apply loaders recursively, depth-first
      if (newLoaders.length > 0) {
        await this.#applyBackendFeatureLoaders(newLoaders);
      }
    }
  }
}

function toInternalBackendFeature(
  feature: BackendFeature,
): InternalBackendFeature {
  if (feature.$$type !== '@backstage/BackendFeature') {
    throw new Error(`Invalid BackendFeature, bad type '${feature.$$type}'`);
  }
  const internal = feature as InternalBackendFeature;
  if (internal.version !== 'v1') {
    throw new Error(
      `Invalid BackendFeature, bad version '${internal.version}'`,
    );
  }
  return internal;
}

function isServiceFactory(
  feature: BackendFeature,
): feature is InternalServiceFactory {
  const internal = toInternalBackendFeature(feature);
  if (internal.featureType === 'service') {
    return true;
  }
  // Backwards compatibility for v1 registrations that use duck typing
  return 'service' in internal;
}

function isBackendRegistrations(
  feature: BackendFeature,
): feature is InternalBackendRegistrations {
  const internal = toInternalBackendFeature(feature);
  if (internal.featureType === 'registrations') {
    return true;
  }
  // Backwards compatibility for v1 registrations that use duck typing
  return 'getRegistrations' in internal;
}

function isBackendFeatureLoader(
  feature: BackendFeature,
): feature is InternalBackendFeatureLoader {
  return toInternalBackendFeature(feature).featureType === 'loader';
}

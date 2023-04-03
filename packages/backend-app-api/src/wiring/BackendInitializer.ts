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
import {
  BackendRegisterInit,
  EnumerableServiceHolder,
  ServiceOrExtensionPoint,
} from './types';
// Direct internal import to avoid duplication
// eslint-disable-next-line @backstage/no-forbidden-package-imports
import { InternalBackendFeature } from '@backstage/backend-plugin-api/src/wiring/types';

export class BackendInitializer {
  #startPromise?: Promise<void>;
  #features = new Array<InternalBackendFeature>();
  #registerInits = new Array<BackendRegisterInit>();
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

  async start(mode: 'standard' | 'declarative'): Promise<void> {
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

    this.#startPromise = this.#doStart(mode);
    await this.#startPromise;
  }

  async #doStart(mode: 'standard' | 'declarative'): Promise<void> {
    // Initialize all root scoped services
    for (const ref of this.#serviceHolder.getServiceRefs()) {
      if (ref.scope === 'root') {
        await this.#serviceHolder.get(ref, 'root');
      }
    }

    if (mode === 'declarative') {
      await this.#loadDeclaredFeatures();
    }

    // Initialize all features
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

        this.#registerInits.push({
          id: r.type === 'plugin' ? r.pluginId : `${r.pluginId}.${r.moduleId}`,
          provides,
          consumes: new Set(Object.values(r.init.deps)),
          init: r.init,
        });
      }
    }

    const orderedRegisterResults = this.#resolveInitOrder(this.#registerInits);

    for (const registerInit of orderedRegisterResults) {
      const deps = await this.#getInitDeps(
        registerInit.init.deps,
        registerInit.id,
      );
      await registerInit.init.func(deps);
    }

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

  #resolveInitOrder(registerInits: Array<BackendRegisterInit>) {
    let registerInitsToOrder = registerInits.slice();
    const orderedRegisterInits = new Array<BackendRegisterInit>();

    // TODO: Validate duplicates

    while (registerInitsToOrder.length > 0) {
      const toRemove = new Set<unknown>();

      for (const registerInit of registerInitsToOrder) {
        const unInitializedDependents = [];

        for (const provided of registerInit.provides) {
          if (
            registerInitsToOrder.some(
              init => init !== registerInit && init.consumes.has(provided),
            )
          ) {
            unInitializedDependents.push(provided);
          }
        }

        if (unInitializedDependents.length === 0) {
          orderedRegisterInits.push(registerInit);
          toRemove.add(registerInit);
        }
      }

      registerInitsToOrder = registerInitsToOrder.filter(r => !toRemove.has(r));
    }

    return orderedRegisterInits;
  }

  async stop(): Promise<void> {
    if (!this.#startPromise) {
      return;
    }
    await this.#startPromise;

    const lifecycleService = await this.#serviceHolder.get(
      coreServices.rootLifecycle,
      'root',
    );

    // TODO(Rugvip): Find a better way to do this
    if (lifecycleService instanceof BackendLifecycleImpl) {
      await lifecycleService.shutdown();
    } else {
      throw new Error('Unexpected lifecycle service implementation');
    }
  }

  async #loadDeclaredFeatures(): Promise<void> {
    const config = await this.#serviceHolder.get(coreServices.config, 'root');
    const logger = await this.#serviceHolder.get(
      coreServices.rootLogger,
      'root',
    );
    const declaredFeatures = config
      ?.getOptionalConfigArray('backend.features')
      ?.map(c => ({
        import: c.getString('import'),
        name: c.getOptionalString('name'),
        options: c.getOptional('options'),
      }));

    for (const feature of declaredFeatures ?? []) {
      const module = require(feature.import);

      if (feature.name) {
        logger?.info(
          `Loading feature '${feature.name}' from '${feature.import}'`,
        );
        this.#features.push(module[feature.name](feature.options));
        continue;
      }

      const detectedFeatures: any = Object.entries(module).filter(
        ([_, f]: any[]) => f?.$$type === '@backstage/BackendFeatureFactory',
      );
      if (detectedFeatures.length === 0) {
        throw new Error(
          `Failed to load declared feature, no feature found in module '${feature.import}'`,
        );
      }
      if (detectedFeatures.length > 1) {
        throw new Error(
          `Failed to load declared feature, multiple features found in module '${feature.import}'. Please specify a name.`,
        );
      }
      const [name, value] = detectedFeatures[0];
      logger?.info(`Loading feature '${name}' from '${feature.import}'`);
      this.#features.push(value(feature.options));
    }
  }
}

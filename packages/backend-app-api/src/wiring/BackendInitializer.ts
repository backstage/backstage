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
import { BackendLifecycleImpl } from '../services/implementations/rootLifecycle/rootLifecycleFactory';
import {
  BackendRegisterInit,
  EnumerableServiceHolder,
  ServiceOrExtensionPoint,
} from './types';

export class BackendInitializer {
  #started = false;
  #features = new Map<BackendFeature, unknown>();
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

  add<TOptions>(feature: BackendFeature, options?: TOptions) {
    if (this.#started) {
      throw new Error('feature can not be added after the backend has started');
    }
    this.#features.set(feature, options);
  }

  async start(): Promise<void> {
    if (this.#started) {
      throw new Error('Backend has already started');
    }
    this.#started = true;

    // Initialize all root scoped services
    for (const ref of this.#serviceHolder.getServiceRefs()) {
      if (ref.scope === 'root') {
        await this.#serviceHolder.get(ref, 'root');
      }
    }

    // Initialize all features
    for (const [feature] of this.#features) {
      const provides = new Set<ExtensionPoint<unknown>>();

      let registerInit: BackendRegisterInit | undefined = undefined;

      feature.register({
        registerExtensionPoint: (extensionPointRef, impl) => {
          if (registerInit) {
            throw new Error('registerExtensionPoint called after registerInit');
          }
          if (this.#extensionPoints.has(extensionPointRef)) {
            throw new Error(`API ${extensionPointRef.id} already registered`);
          }
          this.#extensionPoints.set(extensionPointRef, impl);
          provides.add(extensionPointRef);
        },
        registerInit: registerOptions => {
          if (registerInit) {
            throw new Error('registerInit must only be called once');
          }
          registerInit = {
            id: feature.id,
            provides,
            consumes: new Set(Object.values(registerOptions.deps)),
            deps: registerOptions.deps,
            init: registerOptions.init as BackendRegisterInit['init'],
          };
        },
      });

      if (!registerInit) {
        throw new Error(
          `registerInit was not called by register in ${feature.id}`,
        );
      }

      this.#registerInits.push(registerInit);
    }

    const orderedRegisterResults = this.#resolveInitOrder(this.#registerInits);

    for (const registerInit of orderedRegisterResults) {
      const deps = await this.#getInitDeps(registerInit.deps, registerInit.id);
      await registerInit.init(deps);
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
    if (!this.#started) {
      return;
    }

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
}

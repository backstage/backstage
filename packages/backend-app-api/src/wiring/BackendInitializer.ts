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
  ServiceRef,
} from '@backstage/backend-plugin-api';
import {
  BackendRegisterInit,
  ServiceHolder,
  ServiceOrExtensionPoint,
} from './types';

export class BackendInitializer {
  #started = false;
  #features = new Map<BackendFeature, unknown>();
  #registerInits = new Array<BackendRegisterInit>();
  #extensionPoints = new Map<ExtensionPoint<unknown>, unknown>();
  #serviceHolder: ServiceHolder;

  constructor(serviceHolder: ServiceHolder) {
    this.#serviceHolder = serviceHolder;
  }

  async #getInitDeps(
    deps: { [name: string]: ServiceOrExtensionPoint },
    pluginId: string,
  ) {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(deps).map(async ([name, ref]) => [
          name,
          this.#extensionPoints.get(ref as ExtensionPoint<unknown>) ||
            (await this.#serviceHolder.get(ref as ServiceRef<unknown>)!(
              pluginId,
            )),
        ]),
      ),
    );
  }

  add<TOptions>(feature: BackendFeature, options?: TOptions) {
    if (this.#started) {
      throw new Error('feature can not be added after the backend has started');
    }
    this.#features.set(feature, options);
  }

  async start(): Promise<void> {
    console.log(`Starting backend`);
    if (this.#started) {
      throw new Error('Backend has already started');
    }
    this.#started = true;

    for (const [feature] of this.#features) {
      const provides = new Set<ExtensionPoint<unknown>>();

      let registerInit: BackendRegisterInit | undefined = undefined;

      console.log('Registering', feature.id);
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

    this.validateSetup();

    const orderedRegisterResults = this.#resolveInitOrder(this.#registerInits);

    for (const registerInit of orderedRegisterResults) {
      const deps = await this.#getInitDeps(registerInit.deps, registerInit.id);
      await registerInit.init(deps);
    }
  }

  private validateSetup() {}

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
          console.log(`DEBUG: pushed ${registerInit.id} to results`);
          orderedRegisterInits.push(registerInit);
          toRemove.add(registerInit);
        }
      }

      registerInitsToOrder = registerInitsToOrder.filter(r => !toRemove.has(r));
    }

    return orderedRegisterInits;
  }
}

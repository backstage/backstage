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
  BackendRegistrable,
  ExtensionPoint,
  ServiceRef,
} from '@backstage/backend-plugin-api';
import { BackendRegisterInit, ServiceHolder } from './types';

type ServiceOrExtensionPoint = ExtensionPoint<unknown> | ServiceRef<unknown>;

export class BackendInitializer {
  #started = false;
  #extensions = new Map<BackendRegistrable, unknown>();
  #registerInits = new Array<BackendRegisterInit>();
  #extensionPoints = new Map<ServiceOrExtensionPoint, unknown>();
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
          this.#extensionPoints.get(ref) ||
            (await this.#serviceHolder.get(ref as ServiceRef<unknown>)!(
              pluginId,
            )),
        ]),
      ),
    );
  }

  add<TOptions>(extension: BackendRegistrable, options?: TOptions) {
    if (this.#started) {
      throw new Error(
        'extension can not be added after the backend has started',
      );
    }
    this.#extensions.set(extension, options);
  }

  async start(): Promise<void> {
    console.log(`Starting backend`);
    if (this.#started) {
      throw new Error('Backend has already started');
    }
    this.#started = true;

    for (const [extension] of this.#extensions) {
      const provides = new Set<ServiceRef<unknown>>();

      let registerInit: BackendRegisterInit | undefined = undefined;

      console.log('Registering', extension.id);
      extension.register({
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
            id: extension.id,
            provides,
            consumes: new Set(Object.values(registerOptions.deps)),
            deps: registerOptions.deps,
            init: registerOptions.init as BackendRegisterInit['init'],
          };
        },
      });

      if (!registerInit) {
        throw new Error(
          `registerInit was not called by register in ${extension.id}`,
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

        for (const serviceRef of registerInit.provides) {
          if (
            registerInitsToOrder.some(
              init => init !== registerInit && init.consumes.has(serviceRef),
            )
          ) {
            unInitializedDependents.push(serviceRef);
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

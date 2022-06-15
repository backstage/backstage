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

import { BackendRegistrable, ServiceRef } from '@backstage/backend-plugin-api';
import { BackendRegisterInit, ApiHolder } from './types';

export class BackendInitializer {
  #started = false;
  #extensions = new Map<BackendRegistrable, unknown>();
  // #stops = [];
  #registerInits = new Array<BackendRegisterInit>();
  #apis = new Map<ServiceRef<unknown>, unknown>();
  #apiHolder: ApiHolder;

  constructor(apiHolder: ApiHolder) {
    this.#apiHolder = apiHolder;
  }

  async #getInitDeps(
    deps: { [name: string]: ServiceRef<unknown> },
    pluginId: string,
  ) {
    return Object.fromEntries(
      await Promise.all(
        Object.entries(deps).map(async ([name, apiRef]) => [
          name,
          this.#apis.get(apiRef) ||
            (await this.#apiHolder.get(apiRef)!(pluginId)),
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
        registerExtensionPoint: (api, impl) => {
          if (registerInit) {
            throw new Error('registerInitApi called after registerInit');
          }
          if (this.#apis.has(api)) {
            throw new Error(`API ${api.id} already registered`);
          }
          this.#apis.set(api, impl);
          provides.add(api);
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
      // TODO: DI
      const deps = await this.#getInitDeps(registerInit.deps, registerInit.id);
      await registerInit.init(deps);
      // Maybe return stop? or lifecycle API
      // this.#stops.push();
    }
  }

  // async stop(): Promise<void> {
  //   for (const stop of this.#stops) {
  //     await stop.stop();
  //   }
  // }

  private validateSetup() {}

  #resolveInitOrder(registerInits: Array<BackendRegisterInit>) {
    let registerInitsToOrder = registerInits.slice();
    const orderedRegisterInits = new Array<BackendRegisterInit>();

    // TODO: Validate duplicates

    while (registerInitsToOrder.length > 0) {
      const toRemove = new Set<unknown>();

      for (const registerInit of registerInitsToOrder) {
        const unInitializedDependents = Array.from(
          registerInit.provides,
          // eslint-disable-next-line no-loop-func
        ).filter(r =>
          registerInitsToOrder.some(
            init => init !== registerInit && init.consumes.has(r),
          ),
        );

        if (unInitializedDependents.length === 0) {
          orderedRegisterInits.push(registerInit);
          toRemove.add(registerInit);
        }
      }

      registerInitsToOrder = registerInitsToOrder.filter(r => !toRemove.has(r));
    }
    return orderedRegisterInits;
  }
}

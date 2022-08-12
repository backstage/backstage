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
  BackendRegistrationPoints,
  ExtensionPoint,
  ServiceRef,
} from '@backstage/backend-plugin-api';
import {
  BackendRegisterInit,
  ServiceHolder,
  ServiceOrExtensionPoint,
} from './types';

/**
 * Helper class to receive registrations from features.
 */
class RegistrationPoints implements BackendRegistrationPoints {
  #feature: BackendFeature;
  #extensionPoints = new Map<ExtensionPoint<unknown>, unknown>();
  #registerInit: BackendRegisterInit | undefined = undefined;
  #provides = new Set<ExtensionPoint<unknown>>();

  constructor(feature: BackendFeature) {
    this.#feature = feature;
  }

  registerExtensionPoint<TExtensionPoint>(
    ref: ExtensionPoint<TExtensionPoint>,
    impl: TExtensionPoint,
  ) {
    if (this.#registerInit) {
      throw new Error('registerExtensionPoint called after registerInit');
    } else if (this.#extensionPoints.has(ref)) {
      throw new Error(`API ${ref.id} already registered`);
    }

    this.#extensionPoints.set(ref, impl);
    this.#provides.add(ref);
  }

  registerInit<Deps extends { [name in string]: unknown }>(options: {
    deps: {
      [name in keyof Deps]: ServiceRef<Deps[name]> | ExtensionPoint<Deps[name]>;
    };
    init(deps: Deps): Promise<void>;
  }) {
    if (this.#registerInit) {
      throw new Error('registerInit must only be called once');
    }

    this.#registerInit = {
      id: this.#feature.id,
      provides: this.#provides,
      consumes: new Set(Object.values(options.deps)),
      deps: options.deps,
      init: options.init as BackendRegisterInit['init'],
    };
  }

  build() {
    if (!this.#registerInit) {
      throw new Error(
        `registerInit was not called by register in ${this.#feature.id}`,
      );
    }

    return {
      extensionPoints: this.#extensionPoints,
      registerInit: this.#registerInit,
    };
  }
}

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
    const result = new Map<string, unknown>();
    const missingRefs = new Set<ServiceOrExtensionPoint>();

    for (const [name, ref] of Object.entries(deps)) {
      const extensionPoint = this.#extensionPoints.get(
        ref as ExtensionPoint<unknown>,
      );
      if (extensionPoint) {
        result.set(name, extensionPoint);
      } else {
        const factory = await this.#serviceHolder.get(
          ref as ServiceRef<unknown>,
        );
        if (factory) {
          result.set(name, await factory(pluginId));
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

    for (const [feature] of this.#features) {
      const registrationPoints = new RegistrationPoints(feature);
      feature.register(registrationPoints);
      const { registerInit, extensionPoints } = registrationPoints.build();
      this.#registerInits.push(registerInit);
      this.#extensionPoints.push(...extensionPoints);
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
}

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
  ServiceFactory,
  FactoryFunc,
  ServiceRef,
} from '@backstage/backend-plugin-api';
import { stringifyError } from '@backstage/errors';

/**
 * Keep in sync with `@backstage/backend-plugin-api/src/services/system/types.ts`
 * @internal
 */
export type InternalServiceRef<T> = ServiceRef<T> & {
  __defaultFactory?: (service: ServiceRef<T>) => Promise<ServiceFactory<T>>;
};

export class ServiceRegistry {
  readonly #providedFactories: Map<string, ServiceFactory>;
  readonly #loadedDefaultFactories: Map<Function, Promise<ServiceFactory>>;
  readonly #implementations: Map<
    ServiceFactory,
    {
      factoryFunc: Promise<FactoryFunc<unknown>>;
      byPlugin: Map<string, Promise<unknown>>;
    }
  >;

  constructor(factories: ServiceFactory<any>[]) {
    this.#providedFactories = new Map(factories.map(f => [f.service.id, f]));
    this.#loadedDefaultFactories = new Map();
    this.#implementations = new Map();
  }

  get<T>(ref: ServiceRef<T>): FactoryFunc<T> | undefined {
    let factory = this.#providedFactories.get(ref.id);
    const { __defaultFactory: defaultFactory } = ref as InternalServiceRef<T>;
    if (!factory && !defaultFactory) {
      return undefined;
    }

    return async (pluginId: string): Promise<T> => {
      if (!factory) {
        let loadedFactory = this.#loadedDefaultFactories.get(defaultFactory!);
        if (!loadedFactory) {
          loadedFactory = Promise.resolve().then(
            () => defaultFactory!(ref) as Promise<ServiceFactory>,
          );
          this.#loadedDefaultFactories.set(defaultFactory!, loadedFactory);
        }
        // NOTE: This await is safe as long as #providedFactories is not mutated.
        factory = await loadedFactory.catch(error => {
          throw new Error(
            `Failed to instantiate service '${
              ref.id
            }' because the default factory loader threw an error, ${stringifyError(
              error,
            )}`,
          );
        });
      }

      let implementation = this.#implementations.get(factory);
      if (!implementation) {
        const missingRefs = new Array<ServiceRef<unknown>>();
        const factoryDeps: { [name in string]: FactoryFunc<unknown> } = {};

        for (const [name, serviceRef] of Object.entries(factory.deps)) {
          const target = this.get(serviceRef);
          if (!target) {
            missingRefs.push(serviceRef);
          } else {
            factoryDeps[name] = target;
          }
        }

        if (missingRefs.length) {
          const missing = missingRefs.map(r => `'${r.id}'`).join(', ');
          throw new Error(
            `Failed to instantiate service '${ref.id}' for '${pluginId}' because the following dependent services are missing: ${missing}`,
          );
        }

        implementation = {
          factoryFunc: Promise.resolve()
            .then(() => factory!.factory(factoryDeps))
            .catch(error => {
              throw new Error(
                `Failed to instantiate service '${
                  ref.id
                }' because the top-level factory function threw an error, ${stringifyError(
                  error,
                )}`,
              );
            }),
          byPlugin: new Map(),
        };

        this.#implementations.set(factory, implementation);
      }

      let result = implementation.byPlugin.get(pluginId) as Promise<any>;
      if (!result) {
        result = implementation.factoryFunc.then(func =>
          Promise.resolve()
            .then(() => func(pluginId))
            .catch(error => {
              throw new Error(
                `Failed to instantiate service '${
                  ref.id
                }' for '${pluginId}' because the factory function threw an error, ${stringifyError(
                  error,
                )}`,
              );
            }),
        );

        implementation.byPlugin.set(pluginId, result);
      }

      return result;
    };
  }
}

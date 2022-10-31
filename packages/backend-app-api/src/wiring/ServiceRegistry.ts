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
  ServiceRef,
  pluginMetadataServiceRef,
} from '@backstage/backend-plugin-api';
import { stringifyError } from '@backstage/errors';

/**
 * Keep in sync with `@backstage/backend-plugin-api/src/services/system/types.ts`
 * @internal
 */
export type InternalServiceRef<T> = ServiceRef<T> & {
  __defaultFactory?: (
    service: ServiceRef<T>,
  ) => Promise<ServiceFactory<T> | (() => ServiceFactory<T>)>;
};

export class ServiceRegistry {
  readonly #providedFactories: Map<string, ServiceFactory>;
  readonly #loadedDefaultFactories: Map<Function, Promise<ServiceFactory>>;
  readonly #implementations: Map<
    ServiceFactory,
    {
      factoryFunc: Promise<
        (deps: { [name in string]: unknown }) => Promise<unknown>
      >;
      byPlugin: Map<string, Promise<unknown>>;
    }
  >;

  constructor(
    factories: Array<ServiceFactory<unknown> | (() => ServiceFactory<unknown>)>,
  ) {
    this.#providedFactories = new Map(
      factories.map(f => {
        if (typeof f === 'function') {
          const cf = f();
          return [cf.service.id, cf];
        }
        return [f.service.id, f];
      }),
    );
    this.#loadedDefaultFactories = new Map();
    this.#implementations = new Map();
  }

  #resolveFactory(
    ref: ServiceRef<unknown>,
    pluginId: string,
  ): Promise<ServiceFactory> | undefined {
    // Special case handling of the plugin metadata service, generating a custom factory for it each time
    if (ref.id === pluginMetadataServiceRef.id) {
      return Promise.resolve({
        scope: 'plugin',
        service: pluginMetadataServiceRef,
        deps: {},
        factory: async () => async () => ({
          getId() {
            return pluginId;
          },
        }),
      });
    }

    let resolvedFactory: Promise<ServiceFactory> | ServiceFactory | undefined =
      this.#providedFactories.get(ref.id);
    const { __defaultFactory: defaultFactory } =
      ref as InternalServiceRef<unknown>;
    if (!resolvedFactory && !defaultFactory) {
      return undefined;
    }

    if (!resolvedFactory) {
      let loadedFactory = this.#loadedDefaultFactories.get(defaultFactory!);
      if (!loadedFactory) {
        loadedFactory = Promise.resolve()
          .then(() => defaultFactory!(ref))
          .then(f =>
            typeof f === 'function' ? f() : f,
          ) as Promise<ServiceFactory>;
        this.#loadedDefaultFactories.set(defaultFactory!, loadedFactory);
      }
      resolvedFactory = loadedFactory.catch(error => {
        throw new Error(
          `Failed to instantiate service '${
            ref.id
          }' because the default factory loader threw an error, ${stringifyError(
            error,
          )}`,
        );
      });
    }

    return Promise.resolve(resolvedFactory);
  }

  #separateMapForTheRootService = new Map<ServiceFactory, Promise<unknown>>();

  #checkForMissingDeps(factory: ServiceFactory, pluginId: string) {
    const missingDeps = Object.values(factory.deps).filter(ref => {
      if (ref.id === pluginMetadataServiceRef.id) {
        return false;
      }
      if (this.#providedFactories.get(ref.id)) {
        return false;
      }

      return !(ref as InternalServiceRef<unknown>).__defaultFactory;
    });

    if (missingDeps.length) {
      const missing = missingDeps.map(r => `'${r.id}'`).join(', ');
      throw new Error(
        `Failed to instantiate service '${factory.service.id}' for '${pluginId}' because the following dependent services are missing: ${missing}`,
      );
    }
  }

  get<T>(ref: ServiceRef<T>, pluginId: string): Promise<T> | undefined {
    return this.#resolveFactory(ref, pluginId)?.then(factory => {
      if (factory.scope === 'root') {
        let existing = this.#separateMapForTheRootService.get(factory);
        if (!existing) {
          this.#checkForMissingDeps(factory, pluginId);
          const rootDeps = new Array<Promise<[name: string, impl: unknown]>>();

          for (const [name, serviceRef] of Object.entries(factory.deps)) {
            if (serviceRef.scope !== 'root') {
              throw new Error(
                `Failed to instantiate 'root' scoped service '${ref.id}' because it depends on '${serviceRef.scope}' scoped service '${serviceRef.id}'.`,
              );
            }
            const target = this.get(serviceRef, pluginId)!;
            rootDeps.push(target.then(impl => [name, impl]));
          }

          existing = Promise.all(rootDeps).then(entries =>
            factory.factory(Object.fromEntries(entries)),
          );
          this.#separateMapForTheRootService.set(factory, existing);
        }
        return existing as Promise<T>;
      }

      let implementation = this.#implementations.get(factory);
      if (!implementation) {
        this.#checkForMissingDeps(factory, pluginId);
        const rootDeps = new Array<Promise<[name: string, impl: unknown]>>();

        for (const [name, serviceRef] of Object.entries(factory.deps)) {
          if (serviceRef.scope === 'root') {
            const target = this.get(serviceRef, pluginId)!;
            rootDeps.push(target.then(impl => [name, impl]));
          }
        }

        implementation = {
          factoryFunc: Promise.all(rootDeps)
            .then(entries => factory.factory(Object.fromEntries(entries)))
            .catch(error => {
              const cause = stringifyError(error);
              throw new Error(
                `Failed to instantiate service '${ref.id}' because the top-level factory function threw an error, ${cause}`,
              );
            }),
          byPlugin: new Map(),
        };

        this.#implementations.set(factory, implementation);
      }

      let result = implementation.byPlugin.get(pluginId) as Promise<any>;
      if (!result) {
        const allDeps = new Array<Promise<[name: string, impl: unknown]>>();

        for (const [name, serviceRef] of Object.entries(factory.deps)) {
          const target = this.get(serviceRef, pluginId)!;
          allDeps.push(target.then(impl => [name, impl]));
        }

        result = implementation.factoryFunc
          .then(func =>
            Promise.all(allDeps).then(entries =>
              func(Object.fromEntries(entries)),
            ),
          )
          .catch(error => {
            const cause = stringifyError(error);
            throw new Error(
              `Failed to instantiate service '${ref.id}' for '${pluginId}' because the factory function threw an error, ${cause}`,
            );
          });
        implementation.byPlugin.set(pluginId, result);
      }

      return result;
    });
  }
}

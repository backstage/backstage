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
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { ConflictError, stringifyError } from '@backstage/errors';
// Direct internal import to avoid duplication
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { InternalServiceFactory } from '../../../backend-plugin-api/src/services/system/types';
import { DependencyGraph } from '../lib/DependencyGraph';
/**
 * Keep in sync with `@backstage/backend-plugin-api/src/services/system/types.ts`
 * @internal
 */
export type InternalServiceRef = ServiceRef<unknown> & {
  __defaultFactory?: (
    service: ServiceRef<unknown>,
  ) => Promise<ServiceFactory | (() => ServiceFactory)>;
};

function toInternalServiceFactory<TService, TScope extends 'plugin' | 'root'>(
  factory: ServiceFactory<TService, TScope>,
): InternalServiceFactory<TService, TScope> {
  const f = factory as InternalServiceFactory<TService, TScope>;
  if (f.$$type !== '@backstage/BackendFeature') {
    throw new Error(`Invalid service factory, bad type '${f.$$type}'`);
  }
  if (f.version !== 'v1') {
    throw new Error(`Invalid service factory, bad version '${f.version}'`);
  }
  return f;
}

function createPluginMetadataServiceFactory(pluginId: string) {
  return createServiceFactory({
    service: coreServices.pluginMetadata,
    deps: {},
    factory: async () => ({ getId: () => pluginId }),
  });
}

export class ServiceRegistry {
  static create(factories: Array<ServiceFactory>): ServiceRegistry {
    const factoryMap = new Map<string, InternalServiceFactory[]>();
    for (const factory of factories) {
      if (factory.service.multiton) {
        const existing = factoryMap.get(factory.service.id) ?? [];
        factoryMap.set(
          factory.service.id,
          existing.concat(toInternalServiceFactory(factory)),
        );
      } else {
        factoryMap.set(factory.service.id, [toInternalServiceFactory(factory)]);
      }
    }
    const registry = new ServiceRegistry(factoryMap);
    registry.checkForCircularDeps();
    return registry;
  }

  readonly #providedFactories: Map<string, InternalServiceFactory[]>;
  readonly #loadedDefaultFactories: Map<
    Function,
    Promise<InternalServiceFactory>
  >;
  readonly #implementations: Map<
    InternalServiceFactory,
    {
      context: Promise<unknown>;
      byPlugin: Map<string, Promise<unknown>>;
    }
  >;
  readonly #rootServiceImplementations = new Map<
    InternalServiceFactory,
    Promise<unknown>
  >();
  readonly #addedFactoryIds = new Set<string>();
  readonly #instantiatedFactories = new Set<string>();

  private constructor(factories: Map<string, InternalServiceFactory[]>) {
    this.#providedFactories = factories;
    this.#loadedDefaultFactories = new Map();
    this.#implementations = new Map();
  }

  #resolveFactory(
    ref: ServiceRef<unknown>,
    pluginId: string,
  ): Promise<InternalServiceFactory[]> | undefined {
    // Special case handling of the plugin metadata service, generating a custom factory for it each time
    if (ref.id === coreServices.pluginMetadata.id) {
      return Promise.resolve([
        toInternalServiceFactory(createPluginMetadataServiceFactory(pluginId)),
      ]);
    }

    let resolvedFactory:
      | Promise<InternalServiceFactory[]>
      | InternalServiceFactory[]
      | undefined = this.#providedFactories.get(ref.id);
    const { __defaultFactory: defaultFactory } = ref as InternalServiceRef;
    if (!resolvedFactory && !defaultFactory) {
      return undefined;
    }

    if (!resolvedFactory) {
      let loadedFactory = this.#loadedDefaultFactories.get(defaultFactory!);
      if (!loadedFactory) {
        loadedFactory = Promise.resolve()
          .then(() => defaultFactory!(ref))
          .then(f =>
            toInternalServiceFactory(typeof f === 'function' ? f() : f),
          );
        this.#loadedDefaultFactories.set(defaultFactory!, loadedFactory);
      }
      resolvedFactory = loadedFactory.then(
        factory => [factory],
        error => {
          throw new Error(
            `Failed to instantiate service '${
              ref.id
            }' because the default factory loader threw an error, ${stringifyError(
              error,
            )}`,
          );
        },
      );
    }

    return Promise.resolve(resolvedFactory);
  }

  #checkForMissingDeps(factory: InternalServiceFactory, pluginId: string) {
    const missingDeps = Object.values(factory.deps).filter(ref => {
      if (ref.id === coreServices.pluginMetadata.id) {
        return false;
      }
      if (this.#providedFactories.get(ref.id)) {
        return false;
      }
      if (ref.multiton) {
        return false;
      }

      return !(ref as InternalServiceRef).__defaultFactory;
    });

    if (missingDeps.length) {
      const missing = missingDeps.map(r => `'${r.id}'`).join(', ');
      throw new Error(
        `Failed to instantiate service '${factory.service.id}' for '${pluginId}' because the following dependent services are missing: ${missing}`,
      );
    }
  }

  checkForCircularDeps(): void {
    const graph = DependencyGraph.fromIterable(
      Array.from(this.#providedFactories).map(([serviceId, factories]) => ({
        value: serviceId,
        provides: [serviceId],
        consumes: factories.flatMap(factory =>
          Object.values(factory.deps).map(d => d.id),
        ),
      })),
    );
    const circularDependencies = Array.from(graph.detectCircularDependencies());

    if (circularDependencies.length) {
      const cycles = circularDependencies
        .map(c => c.map(id => `'${id}'`).join(' -> '))
        .join('\n  ');

      throw new ConflictError(`Circular dependencies detected:\n  ${cycles}`);
    }
  }

  hasBeenAdded(ref: ServiceRef<any>) {
    if (ref.id === coreServices.pluginMetadata.id) {
      return true;
    }
    return this.#addedFactoryIds.has(ref.id);
  }

  add(factory: ServiceFactory) {
    const factoryId = factory.service.id;
    if (factoryId === coreServices.pluginMetadata.id) {
      throw new Error(
        `The ${coreServices.pluginMetadata.id} service cannot be overridden`,
      );
    }

    if (this.#instantiatedFactories.has(factoryId)) {
      throw new Error(
        `Unable to set service factory with id ${factoryId}, service has already been instantiated`,
      );
    }

    if (factory.service.multiton) {
      const newFactories = (
        this.#providedFactories.get(factoryId) ?? []
      ).concat(toInternalServiceFactory(factory));
      this.#providedFactories.set(factoryId, newFactories);
    } else {
      if (this.#addedFactoryIds.has(factoryId)) {
        throw new Error(
          `Duplicate service implementations provided for ${factoryId}`,
        );
      }

      this.#addedFactoryIds.add(factoryId);
      this.#providedFactories.set(factoryId, [
        toInternalServiceFactory(factory),
      ]);
    }
  }

  async initializeEagerServicesWithScope(
    scope: 'root' | 'plugin',
    pluginId: string = 'root',
  ) {
    for (const [factory] of this.#providedFactories.values()) {
      if (factory.service.scope === scope) {
        // Root-scoped services are eager by default, plugin-scoped are lazy by default
        if (scope === 'root' && factory.initialization !== 'lazy') {
          await this.get(factory.service, pluginId);
        } else if (scope === 'plugin' && factory.initialization === 'always') {
          await this.get(factory.service, pluginId);
        }
      }
    }
  }

  get<T, TInstances extends 'singleton' | 'multiton'>(
    ref: ServiceRef<T, 'plugin' | 'root', TInstances>,
    pluginId: string,
  ): Promise<TInstances extends 'multiton' ? T[] : T> | undefined {
    this.#instantiatedFactories.add(ref.id);

    const resolvedFactory = this.#resolveFactory(ref, pluginId);

    if (!resolvedFactory) {
      return ref.multiton
        ? (Promise.resolve([]) as
            | Promise<TInstances extends 'multiton' ? T[] : T>
            | undefined)
        : undefined;
    }

    return resolvedFactory
      .then(factories => {
        return Promise.all(
          factories.map(factory => {
            if (factory.service.scope === 'root') {
              let existing = this.#rootServiceImplementations.get(factory);
              if (!existing) {
                this.#checkForMissingDeps(factory, pluginId);
                const rootDeps = new Array<
                  Promise<[name: string, impl: unknown]>
                >();

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
                  factory.factory(Object.fromEntries(entries), undefined),
                );
                this.#rootServiceImplementations.set(factory, existing);
              }
              return existing as Promise<T>;
            }

            let implementation = this.#implementations.get(factory);
            if (!implementation) {
              this.#checkForMissingDeps(factory, pluginId);
              const rootDeps = new Array<
                Promise<[name: string, impl: unknown]>
              >();

              for (const [name, serviceRef] of Object.entries(factory.deps)) {
                if (serviceRef.scope === 'root') {
                  const target = this.get(serviceRef, pluginId)!;
                  rootDeps.push(target.then(impl => [name, impl]));
                }
              }

              implementation = {
                context: Promise.all(rootDeps)
                  .then(entries =>
                    factory.createRootContext?.(Object.fromEntries(entries)),
                  )
                  .catch(error => {
                    const cause = stringifyError(error);
                    throw new Error(
                      `Failed to instantiate service '${ref.id}' because createRootContext threw an error, ${cause}`,
                    );
                  }),
                byPlugin: new Map(),
              };

              this.#implementations.set(factory, implementation);
            }

            let result = implementation.byPlugin.get(pluginId) as Promise<any>;
            if (!result) {
              const allDeps = new Array<
                Promise<[name: string, impl: unknown]>
              >();

              for (const [name, serviceRef] of Object.entries(factory.deps)) {
                const target = this.get(serviceRef, pluginId)!;
                allDeps.push(target.then(impl => [name, impl]));
              }

              result = implementation.context
                .then(context =>
                  Promise.all(allDeps).then(entries =>
                    factory.factory(Object.fromEntries(entries), context),
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
          }),
        );
      })
      .then(results => (ref.multiton ? results : results[0]));
  }
}

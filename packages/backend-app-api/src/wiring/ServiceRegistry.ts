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
import { stringifyError } from '@backstage/errors';
import { EnumerableServiceHolder } from './types';
// Direct internal import to avoid duplication
// eslint-disable-next-line @backstage/no-forbidden-package-imports
import { InternalServiceFactory } from '@backstage/backend-plugin-api/src/services/system/types';
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
  if (f.$$type !== '@backstage/ServiceFactory') {
    throw new Error(`Invalid service factory, bad type '${f.$$type}'`);
  }
  if (f.version !== 'v1') {
    throw new Error(`Invalid service factory, bad version '${f.version}'`);
  }
  return f;
}

const pluginMetadataServiceFactory = createServiceFactory(
  (options: { pluginId: string }) => ({
    service: coreServices.pluginMetadata,
    deps: {},
    factory: async () => ({ getId: () => options.pluginId }),
  }),
);

export class ServiceRegistry implements EnumerableServiceHolder {
  readonly #providedFactories: Map<string, InternalServiceFactory>;
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

  constructor(factories: Array<ServiceFactory>) {
    this.#providedFactories = new Map(
      factories.map(sf => [sf.service.id, toInternalServiceFactory(sf)]),
    );
    this.#loadedDefaultFactories = new Map();
    this.#implementations = new Map();
  }

  #resolveFactory(
    ref: ServiceRef<unknown>,
    pluginId: string,
  ): Promise<InternalServiceFactory> | undefined {
    // Special case handling of the plugin metadata service, generating a custom factory for it each time
    if (ref.id === coreServices.pluginMetadata.id) {
      return Promise.resolve(
        toInternalServiceFactory(pluginMetadataServiceFactory({ pluginId })),
      );
    }

    let resolvedFactory:
      | Promise<InternalServiceFactory>
      | InternalServiceFactory
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

  #checkForMissingDeps(factory: InternalServiceFactory, pluginId: string) {
    const missingDeps = Object.values(factory.deps).filter(ref => {
      if (ref.id === coreServices.pluginMetadata.id) {
        return false;
      }
      if (this.#providedFactories.get(ref.id)) {
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

  getServiceRefs(): ServiceRef<unknown>[] {
    return Array.from(this.#providedFactories.values()).map(f => f.service);
  }

  get<T>(ref: ServiceRef<T>, pluginId: string): Promise<T> | undefined {
    return this.#resolveFactory(ref, pluginId)?.then(factory => {
      if (factory.service.scope === 'root') {
        let existing = this.#rootServiceImplementations.get(factory);
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
            factory.factory(Object.fromEntries(entries), undefined),
          );
          this.#rootServiceImplementations.set(factory, existing);
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
        const allDeps = new Array<Promise<[name: string, impl: unknown]>>();

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
    });
  }
}

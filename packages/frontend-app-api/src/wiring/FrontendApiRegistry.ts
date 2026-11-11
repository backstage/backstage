/*
 * Copyright 2026 The Backstage Authors
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
  AnyApiFactory,
  AnyApiRef,
  ApiFactory,
  ApiHolder,
  ApiLookupResult,
  ApiRef,
} from '@backstage/frontend-plugin-api';

export class FrontendApiRegistry {
  private readonly factories = new Map<string, AnyApiFactory>();

  register(factory: AnyApiFactory) {
    if (this.factories.has(factory.api.id)) {
      return false;
    }

    this.factories.set(factory.api.id, factory);
    return true;
  }

  registerAll(factories: AnyApiFactory[]) {
    for (const factory of factories) {
      this.register(factory);
    }
  }

  set(factory: AnyApiFactory) {
    this.factories.set(factory.api.id, factory);
  }

  setAll(factories: Iterable<AnyApiFactory>) {
    for (const factory of factories) {
      this.set(factory);
    }
  }

  get<T>(
    api: AnyApiRef<T>,
  ):
    | ApiFactory<T, T, { [name: string]: unknown }, 'sync' | 'async'>
    | undefined {
    const factory = this.factories.get(api.id);
    if (!factory) {
      return undefined;
    }

    return factory as ApiFactory<
      T,
      T,
      { [name: string]: unknown },
      'sync' | 'async'
    >;
  }

  getAllApis() {
    const refs = new Set<AnyApiRef>();
    for (const factory of this.factories.values()) {
      refs.add(factory.api);
    }
    return refs;
  }
}

export class FrontendApiResolver implements ApiHolder {
  private readonly apis = new Map<string, unknown>();
  private readonly asyncApis = new Map<string, Promise<unknown>>();
  private readonly primaryRegistry?: FrontendApiRegistry;
  private readonly secondaryRegistry?: FrontendApiRegistry;
  private readonly fallbackApis?: ApiHolder;

  constructor(options: {
    primaryRegistry?: FrontendApiRegistry;
    secondaryRegistry?: FrontendApiRegistry;
    fallbackApis?: ApiHolder;
  }) {
    this.primaryRegistry = options.primaryRegistry;
    this.secondaryRegistry = options.secondaryRegistry;
    this.fallbackApis = options.fallbackApis;
  }

  get<TApi = unknown, TApiRef extends AnyApiRef = ApiRef<TApi>>(
    ref: TApiRef,
  ): ApiLookupResult<TApiRef> {
    return this.load(ref) as ApiLookupResult<TApiRef>;
  }

  isMaterialized(apiRefId: string) {
    return this.apis.has(apiRefId) || this.asyncApis.has(apiRefId);
  }

  invalidate(apiRefIds?: Iterable<string>) {
    if (apiRefIds === undefined) {
      this.apis.clear();
      this.asyncApis.clear();
      return;
    }

    for (const apiRefId of apiRefIds) {
      this.apis.delete(apiRefId);
      this.asyncApis.delete(apiRefId);
    }
  }

  private load<T>(
    ref: AnyApiRef<T>,
    loading: { apiId: string; dependencyName: string }[] = [],
  ): T | Promise<T> | undefined {
    const factory =
      this.primaryRegistry?.get(ref) ?? this.secondaryRegistry?.get(ref);
    if (ref.loading !== 'async' && factory?.api.loading === 'async') {
      const consumer = loading[loading.length - 1];
      throw Object.assign(
        new Error(
          `API '${
            ref.id
          }' is registered with loading: 'async' but was requested synchronously.${
            consumer
              ? ` API '${consumer.apiId}' requests it through dependency '${consumer.dependencyName}'.` +
                ` Dependency path: ${loading
                  .map(entry => `${entry.apiId}[${entry.dependencyName}]`)
                  .join(' -> ')} -> ${ref.id}.` +
                ` Set loading: 'async' on the ref for '${consumer.apiId}' and update its factory as needed.`
              : ` Update the package exporting this API ref, then await apis.get(ref) or use useApi(ref) during rendering.`
          }`,
        ),
        { name: 'AsyncApiAccessError', apiRefId: ref.id },
      );
    }
    if (loading.some(entry => entry.apiId === ref.id)) {
      throw new Error(`Circular dependency of api factory for ${ref}`);
    }
    if (ref.loading === 'async' && this.asyncApis.has(ref.id)) {
      return this.asyncApis.get(ref.id) as Promise<T>;
    }
    try {
      let api: unknown;
      if (this.apis.has(ref.id)) {
        api = this.apis.get(ref.id);
      } else {
        if (!factory) {
          return this.fallbackApis?.get(ref);
        }

        const isAsyncFactory = factory.api.loading === 'async';
        const depEntries = Object.entries(factory.deps);
        const depValues = depEntries.map(([name, depRef]) => {
          try {
            if (!isAsyncFactory && depRef.loading === 'async') {
              throw new Error(
                `Synchronous API '${factory.api.id}' cannot depend on async API '${depRef.id}' through dependency '${name}'.` +
                  ` Dependency path: ${[
                    ...loading,
                    { apiId: factory.api.id, dependencyName: name },
                  ]
                    .map(entry => `${entry.apiId}[${entry.dependencyName}]`)
                    .join(' -> ')} -> ${depRef.id}.` +
                  ` Set loading: 'async' on the ref for '${factory.api.id}' and update its factory as needed.`,
              );
            }
            return this.load(
              isAsyncFactory ? { ...depRef, loading: 'async' } : depRef,
              [...loading, { apiId: factory.api.id, dependencyName: name }],
            );
          } catch (error) {
            if (!isAsyncFactory) {
              throw error;
            }
            return Promise.reject(error);
          }
        });
        const instantiate = (values: unknown[]) => {
          const deps: { [name: string]: unknown } = {};
          for (const [index, [key, depRef]] of depEntries.entries()) {
            if (values[index] === undefined) {
              throw new Error(
                `No API factory available for dependency ${depRef} of dependent ${factory.api}`,
              );
            }
            deps[key] = values[index];
          }
          return factory.factory(deps);
        };

        api = isAsyncFactory
          ? Promise.all(depValues).then(instantiate)
          : instantiate(depValues);
        if (
          !isAsyncFactory &&
          api &&
          typeof (api as Promise<unknown>).then === 'function'
        ) {
          // Observe a rejected promise even though the factory violates its contract.
          Promise.resolve(api).catch(() => {});
          throw new Error(
            `API '${ref.id}' must opt in to async factories using loading: 'async'.` +
              ` Update the ref used to register this factory, or return a synchronous implementation.`,
          );
        }
        this.apis.set(ref.id, api);
      }
      if (ref.loading === 'async') {
        const promise = Promise.resolve(api) as Promise<T>;
        this.asyncApis.set(ref.id, promise);
        return promise;
      }
      return api as T;
    } catch (error) {
      if (ref.loading !== 'async') {
        throw error;
      }
      const promise = Promise.reject<T>(error);
      this.asyncApis.set(ref.id, promise);
      return promise;
    }
  }
}

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
    return this.apis.has(apiRefId);
  }

  invalidate(apiRefIds?: Iterable<string>) {
    if (apiRefIds === undefined) {
      this.apis.clear();
      return;
    }
    for (const apiRefId of apiRefIds) {
      this.apis.delete(apiRefId);
    }
  }

  private load<T>(
    ref: AnyApiRef<T>,
    loading: { apiId: string; dependencyName: string }[] = [],
  ): T | Promise<T> | undefined {
    const factory =
      this.primaryRegistry?.get(ref) ?? this.secondaryRegistry?.get(ref);
    if (
      factory &&
      (factory.api.loading ?? 'sync') !== (ref.loading ?? 'sync')
    ) {
      throw new Error(
        `Conflicting loading mode for API '${ref.id}': the ref declares '${
          ref.loading ?? 'sync'
        }' but the factory declares '${factory.api.loading ?? 'sync'}'.${
          loading.length
            ? ` Dependency path: ${loading
                .map(entry => `${entry.apiId}[${entry.dependencyName}]`)
                .join(' -> ')} -> ${ref.id}.`
            : ''
        } Update consumers and factories to use matching versions of the API ref.`,
      );
    }
    if (loading.some(entry => entry.apiId === ref.id)) {
      throw new Error(`Circular dependency of api factory for ${ref}`);
    }
    if (this.apis.has(ref.id)) {
      return this.apis.get(ref.id) as T | Promise<T>;
    }
    if (!factory) {
      return this.fallbackApis?.get(ref);
    }

    const isAsync = ref.loading === 'async';
    try {
      const depEntries = Object.entries(factory.deps);
      const depValues = depEntries.map(([name, depRef]) => {
        try {
          if (!isAsync && depRef.loading === 'async') {
            throw new Error(
              `Synchronous API '${ref.id}' cannot depend on async API '${depRef.id}' through dependency '${name}'.` +
                ` Set loading: 'async' on the ref for '${ref.id}' and update its factory.`,
            );
          }
          const dep = this.load(depRef, [
            ...loading,
            { apiId: ref.id, dependencyName: name },
          ]);
          if (dep === undefined) {
            throw new Error(
              `No API factory available for dependency ${depRef} of dependent ${factory.api}`,
            );
          }
          return dep;
        } catch (error) {
          if (!isAsync) {
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
      const api = isAsync
        ? Promise.all(depValues).then(instantiate)
        : instantiate(depValues);
      if (
        !isAsync &&
        api &&
        typeof (api as Promise<unknown>).then === 'function'
      ) {
        // Observe a rejected promise even though the factory violates its contract.
        Promise.resolve(api).catch(() => {});
        throw new Error(
          `API '${ref.id}' must opt in to async factories using loading: 'async'.` +
            ' Update the API ref and its consumers, or return a synchronous implementation.',
        );
      }
      this.apis.set(ref.id, api);
      return api as T | Promise<T>;
    } catch (error) {
      if (!isAsync) {
        throw error;
      }
      const promise = Promise.reject<T>(error);
      this.apis.set(ref.id, promise);
      return promise;
    }
  }
}

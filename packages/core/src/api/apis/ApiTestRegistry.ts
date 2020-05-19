/*
 * Copyright 2020 Spotify AB
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

import { ApiRef } from './ApiRef';
import { TypesToApiRefs, AnyApiRef, ApiHolder, ApiFactory } from './types';

export class ApiTestRegistry implements ApiHolder {
  private readonly apis = new Map<AnyApiRef, unknown>();
  private factories = new Map<
    AnyApiRef,
    ApiFactory<unknown, unknown, unknown>
  >();
  private savedFactories = new Map<
    AnyApiRef,
    ApiFactory<unknown, unknown, unknown>
  >();

  get<T>(ref: ApiRef<T>): T | undefined {
    return this.load(ref);
  }

  register<T>(ref: ApiRef<T>, factoryFunc: () => T): ApiTestRegistry;
  register<A, I, D>(factory: ApiFactory<A, I, D>): ApiTestRegistry;
  register<A, I, D, T>(
    factory: ApiRef<T> | ApiFactory<A, I, D>,
    factoryFunc?: () => T,
  ): ApiTestRegistry {
    if (factory instanceof ApiRef) {
      this.factories.set(factory, {
        implements: factory,
        deps: {},
        factory: factoryFunc!,
      });
    } else {
      this.factories.set(factory.implements, factory);
    }
    return this;
  }

  reset() {
    this.factories = this.savedFactories;
    this.apis.clear();
  }

  save(): ApiTestRegistry {
    this.savedFactories = new Map(this.factories);
    return this;
  }

  private load<T>(ref: ApiRef<T>, loading: AnyApiRef[] = []): T | undefined {
    const impl = this.apis.get(ref);
    if (impl) {
      return impl as T;
    }

    const factory = this.factories.get(ref);
    if (!factory) {
      return undefined;
    }

    if (loading.includes(factory.implements)) {
      throw new Error(
        `Circular dependency of api factory for ${factory.implements}`,
      );
    }

    const deps = this.loadDeps(ref, factory.deps, [
      ...loading,
      factory.implements,
    ]);
    const api = factory.factory(deps);
    this.apis.set(ref, api);
    return api as T;
  }

  private loadDeps<T>(
    dependent: ApiRef<unknown>,
    apis: TypesToApiRefs<T>,
    loading: AnyApiRef[],
  ): T {
    const impls = {} as T;

    for (const key in apis) {
      if (apis.hasOwnProperty(key)) {
        const ref = apis[key];

        const api = this.load(ref, loading);
        if (!api) {
          throw new Error(
            `No API factory available for dependency ${ref} of dependent ${dependent}`,
          );
        }
        impls[key] = api;
      }
    }

    return impls;
  }
}

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
    api: ApiRef<T>,
  ): ApiFactory<T, T, { [name: string]: unknown }> | undefined {
    const factory = this.factories.get(api.id);
    if (!factory) {
      return undefined;
    }

    return factory as ApiFactory<T, T, { [name: string]: unknown }>;
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

  get<T>(ref: ApiRef<T>): T | undefined {
    return this.load(ref);
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

  private load<T>(ref: ApiRef<T>, loading: AnyApiRef[] = []): T | undefined {
    const existing = this.apis.get(ref.id);
    if (existing) {
      return existing as T;
    }

    const factory =
      this.primaryRegistry?.get(ref) ?? this.secondaryRegistry?.get(ref);
    if (!factory) {
      return this.fallbackApis?.get(ref);
    }

    if (loading.includes(factory.api)) {
      throw new Error(`Circular dependency of api factory for ${factory.api}`);
    }

    const deps = {} as { [name: string]: unknown };
    for (const [key, depRef] of Object.entries(factory.deps)) {
      const dep = this.load(depRef, [...loading, factory.api]);
      if (!dep) {
        throw new Error(
          `No API factory available for dependency ${depRef} of dependent ${factory.api}`,
        );
      }
      deps[key] = dep;
    }

    const api = factory.factory(deps);
    this.apis.set(ref.id, api);
    return api as T;
  }
}

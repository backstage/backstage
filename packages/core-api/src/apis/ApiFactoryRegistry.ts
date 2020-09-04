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

import {
  ApiFactoryHolder,
  ApiFactory,
  AnyApiRef,
  AnyApiFactory,
} from './types';
import { ApiRef } from './ApiRef';

type ApiFactoryScope =
  | 'default' // Default factories registered by core and plugins
  | 'app' // Factories registered in the app, overriding default ones
  | 'static'; // APIs that can't be overridden, e.g. config

enum ScopeLevels {
  default = 10,
  app = 50,
  static = 100,
}

type FactoryTuple = {
  level: number;
  factory: AnyApiFactory;
};

export class ApiFactoryRegistry implements ApiFactoryHolder {
  private readonly factories = new Map<AnyApiRef, FactoryTuple>();

  register<Api, Impl, Deps extends { [name in string]: unknown }>(
    scope: ApiFactoryScope,
    factory: ApiFactory<Api, Impl, Deps>,
  ) {
    const level = ScopeLevels[scope];
    const existing = this.factories.get(factory.implements);
    if (existing && existing.level > level) {
      return false;
    }

    this.factories.set(factory.implements, { level, factory });
    return true;
  }

  get<T>(
    api: ApiRef<T>,
  ): ApiFactory<T, T, { [x: string]: unknown }> | undefined {
    const tuple = this.factories.get(api);
    if (!tuple) {
      return undefined;
    }
    return tuple.factory as ApiFactory<T, T, { [x: string]: unknown }>;
  }

  getAllApis(): Set<AnyApiRef> {
    return new Set(this.factories.keys());
  }
}

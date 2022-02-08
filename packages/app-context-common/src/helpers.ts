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

import { Dependency, DependencyConfig, TypesToIocDependencies } from './types';

export function createDependencyConfig<
  Dep,
  Impl extends Dep,
  Deps extends { [name in string]: unknown },
>(configuration: DependencyConfig<Dep, Deps>): DependencyConfig<Dep, Deps>;

export function createDependencyConfig<Dep>(
  dependency: DependencyConfig<Dep, {}>,
  instance: Dep,
): DependencyConfig<Dep, {}>;

export function createDependencyConfig<
  Dep,
  Deps extends { [name in string]: unknown },
>(factory: DependencyConfig<Dep, Deps>): DependencyConfig<Dep, Deps> {
  const dependencies = (factory.dependencies ??
    {}) as TypesToIocDependencies<Deps>;
  return {
    id: factory.id,
    dependencies,
    factory: factory.factory,
  };
}

class DependencyHolder<T> implements Dependency<T> {
  constructor(readonly id: symbol) {}

  get T(): T {
    throw new Error(`tried to read DependencyHolder.T of ${this}`);
  }

  toString() {
    return `${String(this.id.description)}`;
  }
}

export function createDependencyRef<T>(id: symbol): Dependency<T> {
  return new DependencyHolder<T>(id);
}

export function createDependencyModule<
  DepDefs extends Record<string, Dependency<any>>,
>(opts: {
  id: string;
  definitions: DepDefs;
  dependencies: DependencyConfig<unknown, { [k: symbol]: unknown }>[];
}) {
  return opts;
}

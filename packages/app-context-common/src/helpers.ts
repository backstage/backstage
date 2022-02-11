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
  DependencyDef,
  DependencyConfig,
  TypesToIocDependencies,
  BackstageModuleOptions,
} from './types';

/**
 * A typescript helper function definition to match types when creating a {@link DependencyConfig}
 *
 * @param configuration - The actual DependencyConfig shape
 *
 * @public
 */
export function createDependencyConfig<
  Dep,
  Impl extends Dep,
  Deps extends { [name in string]: unknown },
>(configuration: DependencyConfig<Dep, Deps>): DependencyConfig<Dep, Deps>;

export function createDependencyConfig<Dep>(
  dependency: DependencyConfig<Dep, {}>,
  instance: Dep,
): DependencyConfig<Dep, {}>;

/**
 * A helper method to construct fully qualified {@link DependencyConfig} object.
 *
 * Defaults dependencies to an empty object if omitted.
 *
 * @param factory - The actual DependencyConfig shape
 *
 * @public
 */
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

/**
 * A holder class to contain references to type information of a {@link DependencyDef}inition
 *
 */
class DependencyHolder<T> implements DependencyDef<T> {
  constructor(readonly id: symbol) {}

  get T(): T {
    throw new Error(`tried to read DependencyHolder.T of ${this}`);
  }

  toString() {
    return `${String(this.id.description)}`;
  }
}

/**
 * A helper function to construct typesafe DependencyHolders based on {@link DependencyDef}initions
 * @param id - A symbol indicating the identifier of the Dependency.
 *             Should be a fully qualified reference to the package name and the Interface this DependencyDef
 *             points to. E.g. Symbol.for('@backstage/backend-common.PluginEndpointDiscovery')
 *
 * @public
 */
export function createDependencyDefinition<T>(id: symbol): DependencyDef<T> {
  return new DependencyHolder<T>(id);
}

/**
 * A helper function to construct wrap objects for a {@link BackstageModule}.
 *
 *
 * @param opts - A {@link BackstageModuleOptions} object.
 *               An identifier, a collection of dependencies this module needs and an initialization function
 *               to instantiate a BackstageModule
 *
 * @public
 */
export function createDependencyModule<T>(
  opts: BackstageModuleOptions<T>,
): BackstageModuleOptions<T> {
  const { id, dependencies, initialize } = opts;
  return dependencies
    ? {
        id,
        dependencies,
        initialize,
      }
    : {
        id,
        dependencies: [] as DependencyConfig<
          unknown,
          { [k: symbol]: unknown }
        >[],
        initialize,
      };
}

/**
 * A helper function to encapsulate id and types when creating collection of dependency definitions.
 *
 * @param opts - id and a keyed collection of dependencies.
 *
 * @public
 */
export function createDependencyDefinitions<
  DepDefs extends Record<string, DependencyDef<any>>,
>(opts: { id: string; definitions: DepDefs }) {
  return opts;
}

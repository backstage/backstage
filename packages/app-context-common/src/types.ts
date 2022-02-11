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

import { interfaces } from 'inversify';

/**
 * An options type to be used to construct a Backstage backend modules that use ApplicationContext
 *
 * @public
 */
export type BackstageModuleOptions<T> = {
  /**
   * Identifier of the module
   */
  id: string;

  /**
   * Entrypoint to the module.
   *
   * A function that receives an ApplicationContext that is constructed to contain dependencies defined
   * as a `dependencies` collection within this options object
   *
   * @param ctx - Instantiated and bound application context that the module entrypoint can use
   *
   * @returns An instance created when the entrypoint function is called
   */
  initialize: (ctx: ApplicationContext) => T;

  /**
   * A collection of dependencies this module depends on.
   */
  dependencies: AnyDependencyConfig[];
};

/**
 * A holder for a module instance constructed via the ModuleManager with an embedded ApplicationContext
 *
 * @public
 */
export interface BackstageModule<T> {
  /**
   * Name of the module
   */
  name: string;

  /**
   * Actual instance of the module which is returned from the entrypoint.
   * For example: A router returned from createRouter function
   */
  instance: T;

  /**
   * A collection of dependencies that this module depends on
   */
  getDependencies(): DependencyDef<unknown>[];
}

/**
 * A typed wrapper around inversion of control container. Built based on inversify.
 *
 * @public
 */
export interface ApplicationContext {
  /**
   * An accessor function to the underlying inversify container
   */
  getContainer(): interfaces.Container;

  /**
   * A type safe helper method to get individual dependencies from the container
   *
   * @param dep - The dependency definition to retrieve
   */
  get<T>(dep: DependencyDef<T>): T;
}

/**
 * A helper type to wrap a type with dependencies into a type holding their respective {@link DependencyDef}s
 *
 * @public
 */
export type TypesToIocDependencies<T> = {
  [key in keyof T]: DependencyDef<T[key]>;
};

/**
 * A helper type to be able to create and use typed dependencies when constructing injected dependencies
 *
 * @public
 */
export type DependencyDef<T> = {
  id: symbol;
  T: T;
};

/**
 * A type for a  configuration object to instantiate a dependency
 * Contains:
 * id: An identifier for the dependency
 * dependencies: An optional object of named dependencies this instance needs
 * factory: A method received dependencies defined in this construct that instantiates the actual dependency
 *
 * @public
 */
export type DependencyConfig<
  Dep,
  Deps extends { [name in string]: unknown },
> = {
  id: DependencyDef<Dep>;
  dependencies?: TypesToIocDependencies<Deps>;
  factory(deps: Deps): Dep;
};

/**
 * A helper type to encapsulate unknown generic dependency config
 *
 * @public
 */
export type AnyDependencyConfig = DependencyConfig<
  unknown,
  { [key in string]: unknown }
>;

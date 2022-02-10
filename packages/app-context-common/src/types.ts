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
 * A options type to be used to construct a Backstage backend plugin that uses ApplicationContext
 *
 * @public
 */
export type BoundPluginOptions<T> = {
  /**
   * Identifier of the plugin
   */
  id: string;

  /**
   * Entrypoint to the plugin.
   *
   * A function that receives an ApplicationContext that is constructed to contain dependencies defined
   * as a `dependencies` collection within this options object
   *
   * @param ctx - Instantiated and bound application context that the plugin entrypoint can use
   */
  initialize: (ctx: ApplicationContext) => T;

  /**
   * A collection of dependencies this plugin depends on.
   */
  dependencies: AnyDependencyConfig[];
};

/**
 * A holder for a plugin instance constructed via the AppContextManager with an embedded ApplicationContext
 *
 * @public
 */
export interface BoundPlugin<T> {
  /**
   * Name of the plugin
   */
  name: string;

  /**
   * Actual instance of the plugin which is returned from the entrypoint.
   * For example: A router returned from createRouter function
   */
  instance: T;

  /**
   * A collection of dependencies that this plugin depends on
   */
  getDependencies(): Dependency<unknown>[];
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
  get<T>(dep: Dependency<T>): T;
}

/**
 * A helper type to wrap a type with dependencies into a type holding their respective {@link Dependency}s
 *
 * @public
 */
export type TypesToIocDependencies<T> = {
  [key in keyof T]: Dependency<T[key]>;
};

/**
 * A helper type to be able to create and use typed dependencies when constructing injected dependencies
 *
 * @public
 */
export type Dependency<T> = {
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
  id: Dependency<Dep>;
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

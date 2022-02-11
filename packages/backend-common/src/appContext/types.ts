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
import { Logger } from 'winston';
import { CustomErrorBase } from '@backstage/errors';
import { AnyDependencyConfig } from '@backstage/app-context-common';
import { interfaces } from 'inversify';

/**
 * Type for options argument passed into the factory method to instantiate a {@link ModuleManager}
 *
 * @public
 */
export type ModuleManagerFactoryOptions = {
  /**
   * A Winston logger impl
   */
  logger: Logger;

  /**
   * Common dependencies that are injected to all modules created
   */
  rootDependencies: AnyDependencyConfig[];
};

/**
 * Type for options argument passed into the factory method to instantiate a {@link InversifyApplicationContext}
 *
 * @public
 */
export type InversifyAppContextOptions = {
  /**
   * A collection of dependency configurations this ApplicationContext should hold
   */
  dependencies: AnyDependencyConfig[];

  /**
   * An optional container argument for cases where a predefined, pre-bound, shared container is needed
   *
   * Defaults to constructing an isolated new container instance for each AppCtx
   */
  container?: interfaces.Container;
};

/**
 * Custom error to indicate when needed dependencies are not injectable to an IoC container.
 * This means that a module is expecting a dependency that is not provided to it during instantiation.
 *
 * @public
 */
export class DependencyNotBoundError extends CustomErrorBase {}

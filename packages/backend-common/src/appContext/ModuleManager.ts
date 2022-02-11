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

import { Container } from 'inversify';
import { Logger } from 'winston';
import {
  AnyDependencyConfig,
  BackstageModule,
  BackstageModuleOptions,
} from '@backstage/app-context-common';
import { InversifyApplicationContext } from './ApplicationContext';
import { ModuleManagerFactoryOptions, DependencyNotBoundError } from './types';

/**
 * A manager class to create, manage and hold reference to Backstage modules
 *
 * Constructs Application Contexts for modules.
 *
 * @public
 */
export class ModuleManager {
  /**
   * Factory method to instantiate a Module Manager
   *
   * @param logger - Winston logger impl
   * @param rootDependencies - Common dependencies that are injected to all modules created
   *
   * @public
   */
  static fromConfig({ logger, rootDependencies }: ModuleManagerFactoryOptions) {
    const modules = new Map<string, BackstageModule<unknown>>();
    return new ModuleManager(modules, rootDependencies, logger);
  }

  /**
   * @param modules - A collection of Backstage Modules this manager holds
   * @param rootDependencies - Common dependencies that are injected to all modules created
   * @param logger - Winston logger impl
   *
   * @private constructor to instantiate a ModuleManager
   */
  private constructor(
    private modules: Map<string, BackstageModule<unknown>>,
    private readonly rootDependencies: AnyDependencyConfig[],
    private readonly logger: Logger,
  ) {}

  /**
   * Accessor to expose registered modules
   *
   * @public
   */
  getModules() {
    return this.modules;
  }

  /**
   * A helper method to construct an Application Context with common dependencies only
   *
   * This is a placeholder to support legacy functionality where implementations are passed in as individual items.
   * We want to use the same singletons from the context so let's build it up making it usable during module registration
   * After all code is migrated to use managed IoC, we don't have the need to construct root context anymore
   *
   * @public
   */
  createRootContext() {
    return InversifyApplicationContext.fromConfig({
      container: new Container(),
      dependencies: this.rootDependencies,
    });
  }

  /**
   * A factory method to create a BackstageModule.
   *
   * Creates an isolated ApplicationContext with an IoC container for the module and binds common
   * and passed in dependencies to it. Validates that all dependencies the module needs are bound to the context.
   *
   * Calls module initialization function and returns an instance of the module to be used in a Backstage application.
   *
   * @param id - Identifier of the module
   * @param initialize - Initialization method of the module
   * @param dependencies - Additional dependencies the module needs. Common dependencies are injected automatically.
   *
   * @returns A BackstageModule with an instantiated instance and access to its dependencies
   *
   * @public
   */
  createModule<T>({
    id,
    initialize,
    dependencies,
  }: BackstageModuleOptions<T>): BackstageModule<T> {
    const ownAndRootDependencies = [...dependencies, ...this.rootDependencies];
    const childLogger = this.logger.child({ type: 'plugin', id: id });
    const childContext = InversifyApplicationContext.fromConfig({
      container: new Container(),
      dependencies: ownAndRootDependencies,
    });

    childLogger.info(
      `Creating application context for module '${id}'. Binding dependencies ${[
        ...new Set(ownAndRootDependencies.map(it => it.id)),
      ].join(', ')}.`,
    );
    const boundModule = {
      name: id,
      instance: initialize(childContext),
      getDependencies() {
        return ownAndRootDependencies.map(it => it.id);
      },
    };

    boundModule.getDependencies().forEach(dependency => {
      try {
        childContext.get(dependency);
      } catch (e) {
        throw new DependencyNotBoundError(
          `failed to retrieve injected dependency for ${dependency}`,
          e,
        );
      }
    });

    this.modules.set(id, boundModule);

    return boundModule;
  }
}

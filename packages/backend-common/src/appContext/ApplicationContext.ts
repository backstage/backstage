/*
 * Copyright 2021 The Backstage Authors
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
import { Container, interfaces } from 'inversify';
import { AnyDependencyConfig, Dependency } from '@backstage/app-context-common';

export interface ApplicationContext {
  getChildContext(identifier: string): ApplicationContext;

  getContainer(): interfaces.Container;

  get<T>(dep: Dependency<T>): T;

  createBoundPlugin<T>(options: BoundPluginOptions<T>): BoundPlugin<T>;
}

export type BoundPluginOptions<T> = {
  plugin: string;
  initialize: (ctx: ApplicationContext) => T;
  dependencies: AnyDependencyConfig[];
};

export interface BoundPlugin<T> {
  name: string;
  instance: T;
  getDependencies(): Dependency<unknown>[];
}

export type InversifyAppContextOptions = {
  logger: Logger;
  dependencies: AnyDependencyConfig[];
  container?: interfaces.Container;
};

export class InversifyApplicationContext implements ApplicationContext {
  private readonly childContexts: Map<string, ApplicationContext>;
  private readonly container: interfaces.Container;
  private readonly logger: Logger;
  private readonly dependencies: AnyDependencyConfig[];

  static fromConfig(opts: InversifyAppContextOptions) {
    const { logger, dependencies, container } = opts;
    logger.info(
      `Constructing Inversify root container with dependencies ${[
        ...new Set(dependencies.map(it => it.id)),
      ].join(', ')}`,
    );
    const context = new InversifyApplicationContext({
      container: container ?? new Container(),
      logger,
      dependencies,
    });
    context.bindDependenciesIfNotBound(dependencies);
    return context;
  }

  private constructor(opts: {
    container: interfaces.Container;
    childContexts?: Map<string, ApplicationContext>;
    logger: Logger;
    dependencies: AnyDependencyConfig[];
  }) {
    const { container, childContexts, logger, dependencies } = opts;
    this.container = container;
    this.logger = logger;
    this.dependencies = dependencies;
    this.childContexts = childContexts ?? new Map<string, ApplicationContext>();
  }

  getContainer() {
    return this.container;
  }

  get<T>(dep: Dependency<T>) {
    return this.container.get<T>(dep.id);
  }

  getChildContext(identifier: string): ApplicationContext {
    if (this.childContexts.has(identifier)) {
      return this.childContexts.get(identifier)!;
    }
    throw Error(
      `Unable to find application context for identifier ${identifier}`,
    );
  }

  createBoundPlugin<T>({
    plugin,
    initialize,
    dependencies,
  }: BoundPluginOptions<T>): BoundPlugin<T> {
    const ownAndRootDependencies = [...dependencies, ...this.dependencies];
    const childContext = new InversifyApplicationContext({
      container: new Container(),
      logger: this.logger.child({ type: 'plugin', plugin }),
      dependencies: ownAndRootDependencies,
    });
    this.childContexts.set(plugin, childContext);

    this.logger.info(
      `Creating application context for plugin '${plugin}'. Binding dependencies ${[
        ...new Set(ownAndRootDependencies.map(it => it.id)),
      ].join(', ')}.`,
    );
    childContext.bindDependenciesIfNotBound(ownAndRootDependencies);
    return {
      name: plugin,
      instance: initialize(childContext),
      getDependencies() {
        return ownAndRootDependencies.map(it => it.id);
      },
    };
  }

  private bindDependenciesIfNotBound(configs: AnyDependencyConfig[]) {
    const extractDependenciesFromContainer = (
      dependencyConfig: AnyDependencyConfig,
      c: interfaces.Container,
    ) => {
      return Object.entries(dependencyConfig.dependencies ?? {}).reduce(
        (acc, [id, dep]) => ({
          ...acc,
          [id]: c.get<typeof dep.T>(dep.id),
        }),
        {},
      );
    };

    configs.forEach(dependencyConfig => {
      // TODO: We are checking binding status naively here.
      // We should accept a config option in dependencyConfig the correct way to check binding status
      // Giving the possibility to force rebind etc. if needed.
      if (!this.container.isBound(dependencyConfig.id.id)) {
        this.container
          .bind(dependencyConfig.id.id)
          // TODO: We are always binding to a dynamic value here by calling the factory to construct a dependency.
          // We should accept a config option in dependencyConfig to determine the binding type instead
          .toDynamicValue(({ container: c }) =>
            dependencyConfig.factory(
              extractDependenciesFromContainer(dependencyConfig, c),
            ),
          );
      }
    });
  }
}

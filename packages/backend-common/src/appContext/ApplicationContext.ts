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
import express from 'express';
import { AnyDependencyConfig, Dependency } from '@backstage/app-context-common';

export interface ApplicationContext {
  getChildContext(identifier: string): ApplicationContext;

  getContainer(): interfaces.Container;

  get<T>(dep: Dependency<T>): T;

  createBoundPlugin(options: BoundPluginOptions): BoundPlugin;

  forPlugin(plugin: string): ApplicationContext;
}

export type BoundPluginOptions = {
  plugin: string;
  createRouter: (ctx: ApplicationContext) => Promise<express.Router>;
  dependencies: AnyDependencyConfig[];
};

export interface BoundPlugin {
  name: string;
  router: Promise<express.Router>;
  getDependencies(): Dependency<unknown>[];
}

export class InversifyApplicationContext implements ApplicationContext {
  private readonly childContexts: Map<string, ApplicationContext>;
  private readonly container: interfaces.Container;
  private readonly identifier: string;
  private readonly logger: Logger;

  static fromConfig({
    logger,
    dependencies,
    container,
    identifier,
  }: {
    logger: Logger;
    dependencies: AnyDependencyConfig[];
    container?: interfaces.Container;
    identifier?: string;
  }) {
    logger.info(
      `Constructing Inversify root container with dependencies ${[
        ...new Set(dependencies.map(it => it.id)),
      ].join(', ')}`,
    );
    const boundContainer =
      InversifyApplicationContext.bindDependenciesIfNotBound(
        dependencies,
        container ?? new Container(),
      );
    return new InversifyApplicationContext({
      identifier: identifier ?? 'root',
      container: boundContainer,
      logger,
    });
  }

  private constructor({
    identifier,
    container,
    childContexts,
    logger,
  }: {
    identifier: string;
    container: interfaces.Container;
    childContexts?: Map<string, ApplicationContext>;
    logger: Logger;
  }) {
    this.identifier = identifier;
    this.container = container;
    this.logger = logger;
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

  createBoundPlugin({
    plugin,
    createRouter,
    dependencies,
  }: BoundPluginOptions): BoundPlugin {
    this.logger.info(
      `Creating application context for plugin '${
        this.identifier
      }'. Binding dependencies ${[
        ...new Set(dependencies.map(it => it.id)),
      ].join(', ')}.`,
    );
    const childContainer = this.getContainer();
    InversifyApplicationContext.bindDependenciesIfNotBound(
      dependencies,
      childContainer,
    );
    return {
      name: plugin,
      router: createRouter(this),
      getDependencies() {
        return dependencies.map(it => it.id);
      },
    };
  }

  forPlugin(plugin: string): ApplicationContext {
    const childContext = new InversifyApplicationContext({
      identifier: plugin,
      container: this.container.createChild(),
      logger: this.logger.child({ type: 'plugin', plugin }),
    });
    this.childContexts.set(plugin, childContext);
    return childContext;
  }

  private static bindDependenciesIfNotBound(
    configs: AnyDependencyConfig[],
    container: interfaces.Container,
  ) {
    configs.forEach(dependencyConfig => {
      if (!container.isBound(dependencyConfig.id.id)) {
        container
          .bind(dependencyConfig.id.id)
          // TODO: We are always binding to a dynamic value here by calling the factory to construct a dependency.
          // We should accept a config option in dependencyConfig to determine the binding type instead
          .toDynamicValue(({ container: c }) => {
            const deps =
              InversifyApplicationContext.extractDependenciesFromContainer(
                dependencyConfig,
                c,
              );
            return dependencyConfig.factory(deps);
          });
      }
    });
    return container;
  }

  private static extractDependenciesFromContainer(
    dependencyConfig: AnyDependencyConfig,
    c: interfaces.Container,
  ) {
    return Object.entries(dependencyConfig.dependencies ?? {}).reduce(
      (acc, [id, dep]) => ({
        ...acc,
        [id]: c.get<typeof dep.T>(dep.id),
      }),
      {},
    );
  }
}

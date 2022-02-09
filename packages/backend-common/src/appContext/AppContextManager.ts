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
  ApplicationContext,
  BoundPlugin,
  BoundPluginOptions,
} from '@backstage/app-context-common';
import { InversifyApplicationContext } from './ApplicationContext';
import { AppContextFactoryOptions, DependencyNotBoundError } from './types';

export class AppContextManager {
  static fromConfig({ logger, rootDependencies }: AppContextFactoryOptions) {
    const appContexts = new Map<string, ApplicationContext>();
    return new AppContextManager(appContexts, rootDependencies, logger);
  }

  private constructor(
    private appContexts: Map<string, ApplicationContext>,
    private readonly rootDependencies: AnyDependencyConfig[],
    private readonly logger: Logger,
  ) {}

  getContexts() {
    return this.appContexts;
  }

  // This is a placeholder to support legacy functionality where implementations are passed in as individual items.
  // We want to use the same singletons from the context so let's build it up so it's usable during plugin registration
  createRootContext() {
    return InversifyApplicationContext.fromConfig({
      container: new Container(),
      dependencies: this.rootDependencies,
    });
  }

  createBoundPlugin<T>({
    id,
    initialize,
    dependencies,
  }: BoundPluginOptions<T>): BoundPlugin<T> {
    const ownAndRootDependencies = [...dependencies, ...this.rootDependencies];
    const childLogger = this.logger.child({ type: 'plugin', id: id });
    const childContext = InversifyApplicationContext.fromConfig({
      container: new Container(),
      dependencies: ownAndRootDependencies,
    });
    this.appContexts.set(id, childContext);

    childLogger.info(
      `Creating application context for plugin '${id}'. Binding dependencies ${[
        ...new Set(ownAndRootDependencies.map(it => it.id)),
      ].join(', ')}.`,
    );

    const boundPlugin = {
      name: id,
      instance: initialize(childContext),
      getDependencies() {
        return ownAndRootDependencies.map(it => it.id);
      },
    };

    boundPlugin.getDependencies().forEach(dependency => {
      try {
        childContext.get(dependency);
      } catch (e) {
        throw new DependencyNotBoundError(
          `failed to retrieve injected dependency for ${dependency}`,
          e,
        );
      }
    });

    return boundPlugin;
  }
}

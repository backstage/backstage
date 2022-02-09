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

import { Container, interfaces } from 'inversify';
import {
  AnyDependencyConfig,
  ApplicationContext,
  Dependency,
} from '@backstage/app-context-common';

export type InversifyAppContextOptions = {
  dependencies: AnyDependencyConfig[];
  container?: interfaces.Container;
};

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

export class InversifyApplicationContext implements ApplicationContext {
  private readonly container: interfaces.Container;

  static fromConfig(opts: InversifyAppContextOptions) {
    const { dependencies, container } = opts;
    return new InversifyApplicationContext({
      container: container ?? new Container(),
      dependencies,
    });
  }

  private constructor(opts: {
    container: interfaces.Container;
    dependencies: AnyDependencyConfig[];
  }) {
    const { container, dependencies } = opts;
    this.container = container;
    this.bindDependenciesIfNotBound(dependencies);
  }

  getContainer() {
    return this.container;
  }

  get<T>(dep: Dependency<T>) {
    return this.container.get<T>(dep.id);
  }

  private bindDependenciesIfNotBound(configs: AnyDependencyConfig[]) {
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

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
  AnyServiceFactory,
  FactoryFunc,
  ServiceRef,
} from '@backstage/backend-plugin-api';

export class ServiceRegistry {
  readonly #implementations: Map<string, Map<string, unknown>>;
  readonly #factories: Map<string, AnyServiceFactory>;

  constructor(factories: AnyServiceFactory[]) {
    this.#factories = new Map(factories.map(f => [f.service.id, f]));
    this.#implementations = new Map();
  }

  get<T>(ref: ServiceRef<T>): FactoryFunc<T> | undefined {
    const factory = this.#factories.get(ref.id);
    if (!factory) {
      return undefined;
    }

    return async (pluginId: string): Promise<T> => {
      let implementations = this.#implementations.get(ref.id);
      if (implementations) {
        if (implementations.has(pluginId)) {
          return implementations.get(pluginId) as T;
        }
      } else {
        implementations = new Map();
        this.#implementations.set(ref.id, implementations);
      }

      const factoryDeps = Object.fromEntries(
        Object.entries(factory.deps).map(([name, serviceRef]) => [
          name,
          this.get(serviceRef)!, // TODO: throw
        ]),
      );

      const factoryFunc = await factory.factory(factoryDeps);
      const implementation = await factoryFunc(pluginId);

      implementations.set(pluginId, implementation);

      return implementation as T;
    };
  }
}

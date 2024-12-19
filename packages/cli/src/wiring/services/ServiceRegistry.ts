/*
 * Copyright 2024 The Backstage Authors
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

import { InternalServiceFactory, ServiceRef } from './types';

export class ServiceRegistry {
  private readonly services = new Map<string, InternalServiceFactory>();
  private readonly dependencies = new Map<string, string[]>();
  private readonly initializedServices = new Map<
    ServiceRef<unknown>,
    unknown
  >();

  register(factory: InternalServiceFactory) {
    console.log(`Registering ${factory.service.id}`);
    if (this.services.has(factory.service.id)) {
      throw new Error(
        `Service with ID ${factory.service.id} is already registered`,
      );
    }
    this.dependencies.set(
      factory.service.id,
      Object.values(factory.deps).map(dep => dep.id),
    );
    this.services.set(factory.service.id, factory);
  }

  get<T = unknown>(ref: ServiceRef<T>): T {
    const service = this.initializedServices.get(ref);
    if (!service) {
      throw new Error(`Service with ID ${ref.id} is not registered`);
    }
    return service as T;
  }

  async initializeScope(scope: 'root' | 'plugin') {
    const matchingServices = [...this.services.values()].filter(
      factory => factory.service.scope === scope,
    );

    console.log(`Registering ${matchingServices.length} services`);

    const matchingDependencies = new Map<string, string[]>();
    for (const service of matchingServices) {
      matchingDependencies.set(
        service.service.id,
        this.dependencies.get(service.service.id) ?? [],
      );
    }

    const sortedServices: Array<InternalServiceFactory> = [];
    const visited = new Set<string>();
    while (sortedServices.length < matchingServices.length) {
      let added = false;
      for (const service of matchingServices) {
        console.log(`Visiting ${service.service.id}`);
        if (visited.has(service.service.id)) {
          console.log(`Skipping ${service.service.id}`);
          continue;
        }
        const deps = matchingDependencies.get(service.service.id) ?? [];
        if (deps.every(dep => visited.has(dep))) {
          console.log(`Adding ${service.service.id}`);
          sortedServices.push(service);
          visited.add(service.service.id);
          added = true;
        }
      }
      if (!added) {
        throw new Error('Circular dependency detected');
      }
    }

    for (const service of sortedServices) {
      const deps = Object.fromEntries(
        Object.entries(service.deps).map(([name, ref]) => [
          name,
          this.initializedServices.get(ref),
        ]),
      );
      this.initializedServices.set(
        service.service,
        await service.factory(deps),
      );
    }
  }
}

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
  Backend,
  cacheFactory,
  configFactory,
  createSpecializedBackend,
  databaseFactory,
  discoveryFactory,
  httpRouterFactory,
  rootHttpRouterFactory,
  lifecycleFactory,
  rootLifecycleFactory,
  loggerFactory,
  permissionsFactory,
  rootLoggerFactory,
  schedulerFactory,
  tokenManagerFactory,
  urlReaderFactory,
  identityFactory,
} from '@backstage/backend-app-api';
import {
  ServiceFactory,
  ServiceFactoryOrFunction,
  SharedBackendEnvironment,
} from '@backstage/backend-plugin-api';

// Internal import of the type to avoid needing to export this.
// eslint-disable-next-line @backstage/no-forbidden-package-imports
import type { InternalSharedBackendEnvironment } from '@backstage/backend-plugin-api/src/wiring/createSharedEnvironment';

export const defaultServiceFactories = [
  cacheFactory(),
  configFactory(),
  databaseFactory(),
  discoveryFactory(),
  httpRouterFactory(),
  identityFactory(),
  lifecycleFactory(),
  loggerFactory(),
  permissionsFactory(),
  rootHttpRouterFactory(),
  rootLifecycleFactory(),
  rootLoggerFactory(),
  schedulerFactory(),
  tokenManagerFactory(),
  urlReaderFactory(),
];

/**
 * @public
 */
export interface CreateBackendOptions {
  env?: SharedBackendEnvironment;
  services?: ServiceFactoryOrFunction[];
}

/**
 * @public
 */
export function createBackend(options?: CreateBackendOptions): Backend {
  const services = new Array<ServiceFactory>();

  // Highest priority: Services passed directly to createBackend
  const providedServices = (options?.services ?? []).map(sf =>
    typeof sf === 'function' ? sf() : sf,
  );
  services.push(...providedServices);

  // Middle priority: Services from the shared environment
  if (options?.env) {
    const env = options.env as unknown as InternalSharedBackendEnvironment;
    if (env.version !== 'v1') {
      throw new Error(
        `Shared environment version '${env.version}' is invalid or not supported`,
      );
    }

    const environmentServices =
      env.services?.filter(
        sf => !services.some(({ service }) => sf.service.id === service.id),
      ) ?? [];
    services.push(...environmentServices);
  }

  // Lowest priority: Default services that are not already provided by environment or directly to createBackend
  const defaultServices = defaultServiceFactories.filter(
    sf => !services.some(({ service }) => service.id === sf.service.id),
  );
  services.push(...defaultServices);

  return createSpecializedBackend({ services });
}

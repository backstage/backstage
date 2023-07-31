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
  cacheServiceFactory,
  configServiceFactory,
  createSpecializedBackend,
  databaseServiceFactory,
  discoveryServiceFactory,
  httpRouterServiceFactory,
  rootHttpRouterServiceFactory,
  lifecycleServiceFactory,
  rootLifecycleServiceFactory,
  loggerServiceFactory,
  permissionsServiceFactory,
  rootLoggerServiceFactory,
  schedulerServiceFactory,
  tokenManagerServiceFactory,
  urlReaderServiceFactory,
  identityServiceFactory,
} from '@backstage/backend-app-api';
import {
  ServiceFactory,
  ServiceFactoryOrFunction,
} from '@backstage/backend-plugin-api';

export const defaultServiceFactories = [
  cacheServiceFactory(),
  configServiceFactory(),
  databaseServiceFactory(),
  discoveryServiceFactory(),
  httpRouterServiceFactory(),
  identityServiceFactory(),
  lifecycleServiceFactory(),
  loggerServiceFactory(),
  permissionsServiceFactory(),
  rootHttpRouterServiceFactory(),
  rootLifecycleServiceFactory(),
  rootLoggerServiceFactory(),
  schedulerServiceFactory(),
  tokenManagerServiceFactory(),
  urlReaderServiceFactory(),
];

/**
 * @public
 */
export interface CreateBackendOptions {
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

  // Lowest priority: Default services that are not already provided by environment or directly to createBackend
  const defaultServices = defaultServiceFactories.filter(
    sf => !services.some(({ service }) => service.id === sf.service.id),
  );
  services.push(...defaultServices);

  return createSpecializedBackend({ services });
}

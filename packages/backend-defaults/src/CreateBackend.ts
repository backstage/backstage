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
} from '@backstage/backend-app-api';
import { ServiceFactoryOrFunction } from '@backstage/backend-plugin-api';

export const defaultServiceFactories = [
  cacheFactory(),
  configFactory(),
  databaseFactory(),
  discoveryFactory(),
  loggerFactory(),
  rootLoggerFactory(),
  permissionsFactory(),
  schedulerFactory(),
  tokenManagerFactory(),
  urlReaderFactory(),
  httpRouterFactory(),
  rootHttpRouterFactory(),
  lifecycleFactory(),
  rootLifecycleFactory(),
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
  const providedServices = (options?.services ?? []).map(sf =>
    typeof sf === 'function' ? sf() : sf,
  );
  const providedIds = new Set(providedServices.map(sf => sf.service.id));
  const neededDefaultFactories = defaultServiceFactories.filter(
    sf => !providedIds.has(sf.service.id),
  );

  return createSpecializedBackend({
    services: [...neededDefaultFactories, ...providedServices],
  });
}

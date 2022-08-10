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
  loggerFactory,
  permissionsFactory,
  schedulerFactory,
  tokenManagerFactory,
  urlReaderFactory,
} from '@backstage/backend-app-api';

export const defaultServiceFactories = [
  cacheFactory,
  configFactory,
  databaseFactory,
  discoveryFactory,
  loggerFactory,
  permissionsFactory,
  schedulerFactory,
  tokenManagerFactory,
  urlReaderFactory,
  httpRouterFactory,
];

import { AnyServiceFactory } from '@backstage/backend-plugin-api';

/**
 * @public
 */
export interface CreateBackendOptions {
  services?: AnyServiceFactory[];
}

/**
 * @public
 */
export function createBackend(options?: CreateBackendOptions): Backend {
  // TODO: merge with provided APIs
  return createSpecializedBackend({
    services: [...defaultServiceFactories, ...(options?.services || [])],
  });
}

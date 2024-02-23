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
  rootConfigServiceFactory,
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
  authServiceFactory,
  httpAuthServiceFactory,
  userInfoServiceFactory,
} from '@backstage/backend-app-api';

export const defaultServiceFactories = [
  authServiceFactory(),
  cacheServiceFactory(),
  rootConfigServiceFactory(),
  databaseServiceFactory(),
  discoveryServiceFactory(),
  httpAuthServiceFactory(),
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
  userInfoServiceFactory(),
  urlReaderServiceFactory(),
];

/**
 * @public
 */
export function createBackend(): Backend {
  return createSpecializedBackend({ defaultServiceFactories });
}
